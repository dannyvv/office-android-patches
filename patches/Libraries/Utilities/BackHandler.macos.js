--- "e:\\github\\fb-react-native-forpatch-base\\Libraries\\Utilities\\BackHandler.macos.js"	1969-12-31 16:00:00.000000000 -0800
+++ "e:\\github\\ms-react-native-forpatch\\Libraries\\Utilities\\BackHandler.macos.js"	2020-01-29 14:10:09.007915000 -0800
@@ -0,0 +1,63 @@
+/**
+ * Copyright (c) 2015-present, Facebook, Inc.
+ *
+ * This source code is licensed under the MIT license found in the
+ * LICENSE file in the root directory of this source tree.
+ *
+ * On Apple TV, this implements back navigation using the TV remote's menu button.
+ * On iOS, this just implements a stub.
+ *
+ * @providesModule BackHandler
+ */
+
+// TODO(macOS ISS#2323203) Copied from BackHandler.ios.js
+
+'use strict';
+
+function emptyFunction() {}
+
+/**
+ * Detect hardware button presses for back navigation.
+ *
+ * Android: Detect hardware back button presses, and programmatically invoke the default back button
+ * functionality to exit the app if there are no listeners or if none of the listeners return true.
+ *
+ * tvOS: Detect presses of the menu button on the TV remote.  (Still to be implemented:
+ * programmatically disable menu button handling
+ * functionality to exit the app if there are no listeners or if none of the listeners return true.)
+ *
+ * iOS: Not applicable.
+ *
+ * macOS: Not applicable.
+ *
+ * The event subscriptions are called in reverse order (i.e. last registered subscription first),
+ * and if one subscription returns true then subscriptions registered earlier will not be called.
+ *
+ * Example:
+ *
+ * ```javascript
+ * BackHandler.addEventListener('hardwareBackPress', function() {
+ *  // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
+ *  // Typically you would use the navigator here to go to the last state.
+ *
+ *  if (!this.onMainScreen()) {
+ *    this.goBack();
+ *    return true;
+ *  }
+ *  return false;
+ * });
+ * ```
+ */
+let BackHandler;
+
+BackHandler = {
+  exitApp: emptyFunction,
+  addEventListener() {
+    return {
+      remove: emptyFunction,
+    };
+  },
+  removeEventListener: emptyFunction,
+};
+
+module.exports = BackHandler;
