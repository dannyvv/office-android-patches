--- "E:\\github\\fb-react-native-forpatch-base\\ReactAndroid\\src\\main\\jni\\third-party\\v8platform\\Android.mk"	1969-12-31 16:00:00.000000000 -0800
+++ "E:\\github\\ms-react-native-forpatch\\ReactAndroid\\src\\main\\jni\\third-party\\v8platform\\Android.mk"	2020-01-29 14:10:09.689889900 -0800
@@ -0,0 +1,6 @@
+LOCAL_PATH:= $(call my-dir)
+include $(CLEAR_VARS)
+include $(LOCAL_PATH)/../v8/base.mk
+LOCAL_MODULE:= v8platform
+LOCAL_SRC_FILES := $(LIB_PATH)/libv8_libplatform.cr.so
+include $(PREBUILT_SHARED_LIBRARY)
\ No newline at end of file
