package com.lafouch.app;

// Lê as notificações do Nubank ("Pix recebido") para o app confirmar o PIX sozinho (v450).
// Só guarda notificações do pacote com.nu.production; nenhuma outra é lida nem guardada.
// Copiado para o projeto Android por tools/patch-android-impressora.py.

import android.app.Notification;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import org.json.JSONArray;
import org.json.JSONObject;

public class LfNotifService extends NotificationListenerService {
    static final String PREF = "lf_notif";
    static final String FILA = "fila";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        try {
            String pkg = sbn.getPackageName();
            if (!"com.nu.production".equals(pkg)) return;
            Bundle ex = sbn.getNotification().extras;
            if (ex == null) return;
            CharSequence ti = ex.getCharSequence(Notification.EXTRA_TITLE);
            CharSequence tx = ex.getCharSequence(Notification.EXTRA_BIG_TEXT);
            if (tx == null) tx = ex.getCharSequence(Notification.EXTRA_TEXT);
            JSONObject o = new JSONObject();
            o.put("pkg", pkg);
            o.put("title", ti == null ? "" : ti.toString());
            o.put("text", tx == null ? "" : tx.toString());
            o.put("ts", sbn.getPostTime());
            o.put("key", sbn.getKey() + "|" + sbn.getPostTime());
            if (LfNotifPlugin.ativo != null) {
                LfNotifPlugin.ativo.entrega(o);
                return;
            }
            guarda(this, o);
        } catch (Exception e) {
            // nunca derruba o serviço
        }
    }

    static synchronized void guarda(Context c, JSONObject o) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
            JSONArray a = new JSONArray(sp.getString(FILA, "[]"));
            a.put(o);
            JSONArray b = new JSONArray();
            for (int i = Math.max(0, a.length() - 30); i < a.length(); i++) b.put(a.get(i));
            sp.edit().putString(FILA, b.toString()).apply();
        } catch (Exception e) {
        }
    }

    static synchronized JSONArray tira(Context c) {
        SharedPreferences sp = c.getSharedPreferences(PREF, Context.MODE_PRIVATE);
        JSONArray a;
        try {
            a = new JSONArray(sp.getString(FILA, "[]"));
        } catch (Exception e) {
            a = new JSONArray();
        }
        sp.edit().putString(FILA, "[]").apply();
        return a;
    }
}
