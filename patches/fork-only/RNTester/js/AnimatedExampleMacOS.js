--- "E:\\github\\fb-react-native-forpatch-base\\RNTester\\js\\AnimatedExampleMacOS.js"	1969-12-31 16:00:00.000000000 -0800
+++ "E:\\github\\ms-react-native-forpatch\\RNTester\\js\\AnimatedExampleMacOS.js"	2020-01-29 14:10:09.162890200 -0800
@@ -0,0 +1,186 @@
+/**
+ * Copyright (c) 2015-present, Facebook, Inc.
+ *
+ * This source code is licensed under the MIT license found in the
+ * LICENSE file in the root directory of this source tree.
+ *
+ * @flow
+ */
+'use strict';
+
+var React = require('react');
+var ReactNative = require('react-native');
+var {
+  Animated,
+  Easing,
+  StyleSheet,
+  Text,
+  View,
+} = ReactNative;
+var RNTesterButton = require('./RNTesterButton');
+
+exports.framework = 'React';
+exports.title = 'Animated - Examples';
+exports.description = 'Animated provides a powerful ' +
+  'and easy-to-use API for building modern, ' +
+  'interactive user experiences.';
+
+exports.examples = [
+  {
+    title: 'FadeInView',
+    description: 'Uses a simple timing animation to ' +
+      'bring opacity from 0 to 1 when the component ' +
+      'mounts.',
+    render: function() {
+      class FadeInView extends React.Component<$FlowFixMeProps, any> {
+        state: any;
+
+        constructor(props) {
+          super(props);
+          this.state = {
+            fadeAnim: new Animated.Value(0), // opacity 0
+          };
+        }
+        componentDidMount() {
+          Animated.timing(       // Uses easing functions
+            this.state.fadeAnim, // The value to drive
+            {
+              toValue: 1,        // Target
+              duration: 2000,    // Configuration
+            },
+          ).start();             // Don't forget start!
+        }
+        render() {
+          return (
+            <Animated.View   // Special animatable View
+              style={{
+                opacity: this.state.fadeAnim,  // Binds
+              }}>
+              {this.props.children}
+            </Animated.View>
+          );
+        }
+      }
+      class FadeInExample extends React.Component<$FlowFixMeProps, any> {
+        state: any;
+        /* $FlowFixMe(>=0.85.0 site=react_native_fb) This comment suppresses an
+         * error found when Flow v0.85 was deployed. To see the error, delete
+         * this comment and run Flow. */
+        constructor(props) {
+          super(props);
+          this.state = {
+            show: true,
+          };
+        }
+        render() {
+          return (
+            <View>
+              <RNTesterButton onPress={() => {
+                  this.setState((state) => (
+                    {show: !state.show}
+                  ));
+                }}>
+                Press to {this.state.show ?
+                  'Hide' : 'Show'}
+              </RNTesterButton>
+              {this.state.show && <FadeInView>
+                <View style={styles.content}>
+                  <Text>FadeInView</Text>
+                </View>
+              </FadeInView>}
+            </View>
+          );
+        }
+      }
+      return <FadeInExample />;
+    },
+  },
+  {
+    title: 'Composite Animations with Easing',
+    description: 'Sequence, parallel, delay, and ' +
+      'stagger with different easing functions.',
+    render: function() {
+      this.anims = this.anims || [1,2,3].map(
+        () => new Animated.Value(0)
+      );
+      return (
+        <View>
+          <RNTesterButton onPress={() => {
+            var timing = Animated.timing;
+            Animated.sequence([ // One after the other
+              timing(this.anims[0], {
+                toValue: 200,
+                easing: Easing.linear,
+              }),
+              Animated.delay(400), // Use with sequence
+              timing(this.anims[0], {
+                toValue: 0,
+                easing: Easing.elastic(2), // Springy
+              }),
+              Animated.delay(400),
+              Animated.stagger(200,
+                this.anims.map((anim) => timing(
+                  anim, {toValue: 200}
+                )).concat(
+                this.anims.map((anim) => timing(
+                  anim, {toValue: 0}
+                ))),
+              ),
+              Animated.delay(400),
+              Animated.parallel([
+                Easing.inOut(Easing.quad), // Symmetric
+                Easing.back(1.5),  // Goes backwards first
+                Easing.ease,        // Default bezier
+              ].map((easing, ii) => (
+                timing(this.anims[ii], {
+                  toValue: 320, easing, duration: 3000,
+                })
+              ))),
+              Animated.delay(400),
+              Animated.stagger(200,
+                this.anims.map((anim) => timing(anim, {
+                  toValue: 0,
+                  easing: Easing.bounce, // Like a ball
+                  duration: 2000,
+                })),
+              ),
+            ]).start(); }}>
+            Press to Animate
+          </RNTesterButton>
+          {['Composite', 'Easing', 'Animations!'].map(
+            (text, ii) => (
+              <Animated.View
+                key={text}
+                style={[styles.content, {
+                  left: this.anims[ii],
+                }]}>
+                <Text>{text}</Text>
+              </Animated.View>
+            )
+          )}
+        </View>
+      );
+    },
+  },
+  {
+    title: 'Continuous Interactions',
+    description: 'Gesture events, chaining, 2D ' +
+      'values, interrupting and transitioning ' +
+      'animations, etc.',
+    render: () => (
+      <Text>Checkout the Gratuitous Animation App!</Text>
+    ),
+  },
+];
+
+var styles = StyleSheet.create({
+  content: {
+    backgroundColor: 'deepskyblue',
+    borderWidth: 1,
+    borderColor: 'dodgerblue',
+    padding: 20,
+    margin: 20,
+    borderRadius: 10,
+    alignItems: 'center',
+  },
+});
