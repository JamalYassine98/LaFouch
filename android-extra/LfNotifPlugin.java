package com.lafouch.app;

// Ponte entre o LfNotifService e o app (src/97-pagamento-auto.js): status do acesso, abrir o ajuste,
// notificações guardadas com o app fechado e evento "notificacao" com o app aberto.

import android.content.ComponentName;
import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "LfNotif")
public class LfNotifPlugin extends Plugin {
    static volatile LfNotifPlugin ativo = null;

    @Override
    public void load() {
        ativo = this;
    }

    @Override
    protected void handleOnDestroy() {
        if (ativo == this) ativo = null;
    }

    void entrega(JSONObject o) {
        try {
            if (hasListeners("notificacao")) notifyListeners("notificacao", JSObject.fromJSONObject(o));
            else LfNotifService.guarda(getContext(), o);
        } catch (Exception e) {
            LfNotifService.guarda(getContext(), o);
        }
    }

    private boolean temAcesso() {
        String s = Settings.Secure.getString(getContext().getContentResolver(), "enabled_notification_listeners");
        ComponentName cn = new ComponentName(getContext(), LfNotifService.class);
        return s != null && s.contains(cn.flattenToString());
    }

    @PluginMethod
    public void status(PluginCall call) {
        JSObject r = new JSObject();
        r.put("acesso", temAcesso());
        call.resolve(r);
    }

    @PluginMethod
    public void pedirAcesso(PluginCall call) {
        try {
            Intent i = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject("Não consegui abrir os ajustes");
        }
    }

    @PluginMethod
    public void pendentes(PluginCall call) {
        JSONArray a = LfNotifService.tira(getContext());
        JSArray itens = new JSArray();
        for (int i = 0; i < a.length(); i++) {
            try {
                itens.put(JSObject.fromJSONObject(a.getJSONObject(i)));
            } catch (Exception e) {
            }
        }
        JSObject r = new JSObject();
        r.put("itens", itens);
        call.resolve(r);
    }
}
