package com.lafouch.app;

// Impressoras térmicas (qualquer marca, padrão ESC/POS) por Wi-Fi/rede (porta 9100) e Bluetooth (SPP).
// Copiado para android/app/src/main/java/com/lafouch/app/ pelo build-apk.yml (tools/patch-android-impressora.py).
// O app (src/97-impressora.js) manda os bytes prontos em base64; aqui só procuramos e enviamos.

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothClass;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@CapacitorPlugin(
    name = "LfPrinter",
    permissions = {
        @Permission(alias = "bt", strings = { Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT }),
        @Permission(alias = "btOld", strings = { Manifest.permission.BLUETOOTH, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.ACCESS_FINE_LOCATION })
    }
)
public class LfPrinterPlugin extends Plugin {

    private static final UUID SPP = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private String btAlias() {
        return Build.VERSION.SDK_INT >= 31 ? "bt" : "btOld";
    }

    // ---------- Wi-Fi / rede: procura quem responde na porta 9100 na mesma rede (/24) ----------
    @PluginMethod
    public void scanWifi(final PluginCall call) {
        final int timeout = call.getInt("timeoutMs", 350);
        new Thread(() -> {
            JSArray out = new JSArray();
            try {
                String base = minhaRede();
                if (base != null) {
                    final List<JSObject> achou = Collections.synchronizedList(new ArrayList<>());
                    ExecutorService ex = Executors.newFixedThreadPool(48);
                    for (int i = 1; i < 255; i++) {
                        final String ip = base + i;
                        ex.execute(() -> {
                            try (Socket s = new Socket()) {
                                s.connect(new InetSocketAddress(ip, 9100), timeout);
                                JSObject o = new JSObject();
                                o.put("ip", ip);
                                o.put("nome", nomeDaImpressora(s));
                                achou.add(o);
                            } catch (Exception ignored) {
                            }
                        });
                    }
                    ex.shutdown();
                    ex.awaitTermination(20, TimeUnit.SECONDS);
                    for (JSObject o : achou) out.put(o);
                }
                JSObject r = new JSObject();
                r.put("itens", out);
                call.resolve(r);
            } catch (Exception e) {
                call.reject("Falha ao procurar na rede: " + e.getMessage());
            }
        }).start();
    }

    // Rede do aparelho, ex.: "192.168.0." (primeiro IPv4 que não é da própria máquina).
    private String minhaRede() throws Exception {
        for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
            if (!ni.isUp() || ni.isLoopback()) continue;
            for (InetAddress a : Collections.list(ni.getInetAddresses())) {
                if (a instanceof Inet4Address && !a.isLoopbackAddress()) {
                    String ip = a.getHostAddress();
                    if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.")) {
                        return ip.substring(0, ip.lastIndexOf('.') + 1);
                    }
                }
            }
        }
        return null;
    }

    // Pergunta o modelo (GS I 67). Muitas térmicas respondem; se não, fica "Impressora térmica".
    private String nomeDaImpressora(Socket s) {
        try {
            s.setSoTimeout(500);
            OutputStream o = s.getOutputStream();
            o.write(new byte[] { 0x1D, 0x49, 0x43 });
            o.flush();
            InputStream in = s.getInputStream();
            byte[] b = new byte[64];
            int n = in.read(b);
            if (n > 2) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    int c = b[i] & 0xff;
                    if (c >= 32 && c < 127) sb.append((char) c);
                }
                String t = sb.toString().replace("_", "").trim();
                if (t.length() >= 3) return t;
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    @PluginMethod
    public void printWifi(final PluginCall call) {
        final String ip = call.getString("ip");
        final int port = call.getInt("port", 9100);
        final String data = call.getString("data");
        if (ip == null || data == null) {
            call.reject("Faltou o endereço ou os dados");
            return;
        }
        new Thread(() -> {
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(ip, port), 3000);
                OutputStream o = s.getOutputStream();
                o.write(Base64.decode(data, Base64.DEFAULT));
                o.flush();
                Thread.sleep(300);
                call.resolve();
            } catch (Exception e) {
                call.reject("A impressora não respondeu na rede");
            }
        }).start();
    }

    // ---------- Bluetooth ----------
    private BluetoothAdapter adaptador() {
        BluetoothManager m = (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
        return m == null ? null : m.getAdapter();
    }

    private boolean temPermBt() {
        return getPermissionState(btAlias()) == PermissionState.GRANTED;
    }

    @PluginMethod
    public void scanBluetooth(PluginCall call) {
        if (!temPermBt()) {
            requestPermissionForAlias(btAlias(), call, "permBtScan");
            return;
        }
        fazScanBt(call);
    }

    @PermissionCallback
    private void permBtScan(PluginCall call) {
        if (!temPermBt()) {
            call.reject("Sem permissão do Bluetooth");
            return;
        }
        fazScanBt(call);
    }

    @SuppressLint("MissingPermission")
    private void fazScanBt(final PluginCall call) {
        final BluetoothAdapter ad = adaptador();
        if (ad == null) {
            call.reject("Este aparelho não tem Bluetooth");
            return;
        }
        if (!ad.isEnabled()) {
            call.reject("Bluetooth desligado");
            return;
        }
        final Map<String, JSObject> vistos = new HashMap<>();
        for (BluetoothDevice d : ad.getBondedDevices()) vistos.put(d.getAddress(), dispositivo(d, true));
        final int ms = call.getInt("timeoutMs", 8000);
        final BroadcastReceiver rec = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                if (BluetoothDevice.ACTION_FOUND.equals(i.getAction())) {
                    BluetoothDevice d = i.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                    if (d != null && !vistos.containsKey(d.getAddress())) vistos.put(d.getAddress(), dispositivo(d, false));
                }
            }
        };
        getContext().registerReceiver(rec, new IntentFilter(BluetoothDevice.ACTION_FOUND));
        try {
            ad.startDiscovery();
        } catch (Exception ignored) {
        }
        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
            try {
                ad.cancelDiscovery();
            } catch (Exception ignored) {
            }
            try {
                getContext().unregisterReceiver(rec);
            } catch (Exception ignored) {
            }
            JSArray out = new JSArray();
            for (JSObject o : vistos.values()) out.put(o);
            JSObject r = new JSObject();
            r.put("itens", out);
            call.resolve(r);
        }, ms);
    }

    @SuppressLint("MissingPermission")
    private JSObject dispositivo(BluetoothDevice d, boolean pareado) {
        JSObject o = new JSObject();
        String nome = "";
        try {
            nome = d.getName();
        } catch (Exception ignored) {
        }
        boolean imp = false;
        try {
            BluetoothClass k = d.getBluetoothClass();
            imp = k != null && k.getMajorDeviceClass() == BluetoothClass.Device.Major.IMAGING;
        } catch (Exception ignored) {
        }
        o.put("address", d.getAddress());
        o.put("nome", nome == null ? "" : nome);
        o.put("pareado", pareado);
        o.put("impressora", imp);
        return o;
    }

    @PluginMethod
    public void printBluetooth(PluginCall call) {
        if (!temPermBt()) {
            requestPermissionForAlias(btAlias(), call, "permBtPrint");
            return;
        }
        fazPrintBt(call);
    }

    @PermissionCallback
    private void permBtPrint(PluginCall call) {
        if (!temPermBt()) {
            call.reject("Sem permissão do Bluetooth");
            return;
        }
        fazPrintBt(call);
    }

    @SuppressLint("MissingPermission")
    private void fazPrintBt(final PluginCall call) {
        final String addr = call.getString("address");
        final String data = call.getString("data");
        final BluetoothAdapter ad = adaptador();
        if (ad == null || addr == null || data == null) {
            call.reject("Faltou a impressora ou os dados");
            return;
        }
        new Thread(() -> {
            BluetoothSocket s = null;
            try {
                try {
                    ad.cancelDiscovery();
                } catch (Exception ignored) {
                }
                BluetoothDevice d = ad.getRemoteDevice(addr);
                try {
                    s = d.createRfcommSocketToServiceRecord(SPP);
                    s.connect();
                } catch (Exception e1) {
                    try {
                        if (s != null) s.close();
                    } catch (Exception ignored) {
                    }
                    s = d.createInsecureRfcommSocketToServiceRecord(SPP);
                    s.connect();
                }
                OutputStream o = s.getOutputStream();
                o.write(Base64.decode(data, Base64.DEFAULT));
                o.flush();
                Thread.sleep(600);
                call.resolve();
            } catch (Exception e) {
                call.reject("A impressora não respondeu no Bluetooth");
            } finally {
                try {
                    if (s != null) s.close();
                } catch (Exception ignored) {
                }
            }
        }).start();
    }
}
