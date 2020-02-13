--- "e:\\github\\fb-react-native-forpatch-base\\Libraries\\Settings\\Settings.macos.js"	1969-12-31 16:00:00.000000000 -0800
+++ "e:\\github\\ms-react-native-forpatch\\Libraries\\Settings\\Settings.macos.js"	2020-01-29 14:10:08.979884500 -0800
@@ -0,0 +1,85 @@
+/**
+ * Copyright (c) 2015-present, Facebook, Inc.
+ *
+ * This source code is licensed under the MIT license found in the
+ * LICENSE file in the root directory of this source tree.
+ *
+ * @providesModule Settings
+ * @flow
+ */
+
+// TODO(macOS ISS#2323203) Copied from Settings.ios.js
+
+'use strict';
+
+var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
+var RCTSettingsManager = require('NativeModules').SettingsManager;
+
+var invariant = require('fbjs/lib/invariant');
+
+var subscriptions: Array<{keys: Array<string>, callback: ?Function}> = [];
+
+var Settings = {
+  _settings: RCTSettingsManager && RCTSettingsManager.settings,
+
+  get(key: string): mixed {
+    return this._settings[key];
+  },
+
+  set(settings: Object) {
+    this._settings = Object.assign(this._settings, settings);
+    RCTSettingsManager.setValues(settings);
+  },
+
+  watchKeys(keys: string | Array<string>, callback: Function): number {
+    if (typeof keys === 'string') {
+      keys = [keys];
+    }
+
+    invariant(
+      Array.isArray(keys),
+      'keys should be a string or array of strings'
+    );
+
+    //start monitoring for changes to NSUserDefaults
+    RCTSettingsManager.setIsMonitoringEnabled(true);
+
+    var sid = subscriptions.length;
+    subscriptions.push({keys: keys, callback: callback});
+    return sid;
+  },
+
+  clearWatch(watchId: number) {
+    if (watchId < subscriptions.length) {
+      subscriptions[watchId] = {keys: [], callback: null};
+
+      if (!subscriptions.some(subscription => subscription.callback != null)) {
+        // no subscribers present, stop listening for changes.
+        RCTSettingsManager.setIsMonitoringEnabled(false);
+      }
+    }
+  },
+
+  _sendObservations(body: Object) {
+    Object.keys(body).forEach((key) => {
+      var newValue = body[key];
+      var didChange = this._settings[key] !== newValue;
+      this._settings[key] = newValue;
+
+      if (didChange) {
+        subscriptions.forEach((sub) => {
+          if (sub.keys.indexOf(key) !== -1 && sub.callback) {
+            sub.callback();
+          }
+        });
+      }
+    });
+  },
+};
+
+RCTDeviceEventEmitter.addListener(
+  'settingsUpdated',
+  Settings._sendObservations.bind(Settings)
+);
+
+module.exports = Settings;
