--- "E:\\github\\fb-react-native-forpatch-base\\scripts\\auto-sync-sdxplatform-to-reactnative.js"	1969-12-31 16:00:00.000000000 -0800
+++ "E:\\github\\ms-react-native-forpatch\\scripts\\auto-sync-sdxplatform-to-reactnative.js"	2020-01-29 14:10:10.015894300 -0800
@@ -0,0 +1,99 @@
+let child_process = require('child_process');
+
+const branchName = 'sdx-to-rn';
+const vsoApiUrl = process.env.VSO_API_URL ? process.env.VSO_API_URL : 'https://office.visualstudio.com/DefaultCollection/_apis';
+const ISSUrl = 'https://office.visualstudio.com/DefaultCollection/ISS/_git/';
+const vsoRepoID = 'b8bb01d6-6226-4852-a03d-cd1cbc9efc48';
+
+let pullRequestTitle = 'auto-sync from ISS\\sdx-platform to ISS\\react-native';
+let pullRequestDescription = pullRequestTitle + '. This pull request is auto-generated by script';
+
+let myArgs = process.argv.slice(2);
+let myToken = myArgs[0];
+
+function cloneRepoAndCreatBranch() {
+    child_process.execSync(`git clone ${ISSUrl}sdx-platform tempSDX`, { stdio: [0, 1, 2] });
+
+    child_process.execSync(`git clone ${ISSUrl}react-native tempRN`, { stdio: [0, 1, 2] });
+
+    child_process.execSync(`git -C tempRN checkout -b ${branchName}`, { stdio: [0, 1, 2] });
+
+    child_process.execSync(`git -C tempRN push -u origin ${branchName}`, { stdio: [0, 1, 2] });
+}
+
+function removeSubtreeAddSubmodule(repo) {
+    child_process.execSync(`git -C tempRN rm -r ${repo}`, { stdio: [0, 1, 2] });
+
+    child_process.execSync(`git -C tempRN submodule add ${ISSUrl}${repo}`, { stdio: [0, 1, 2] });
+}
+
+function syncRepo() {
+    cloneRepoAndCreatBranch();
+
+    try {
+        child_process.execSync(`git -C tempSDX subtree push --prefix=src/react-native/ ${ISSUrl}react-native sdx-to-rn`, { stdio: [0, 1, 2] });
+    }
+    catch (e) {
+        console.log('sdx-platform has not updated, need to sync from react-native to sdx-platform first');
+
+        child_process.execSync(`git -C tempRN push -d origin ${branchName}`, { stdio: [0, 1, 2] });
+
+        child_process.execSync(`git -C tempRN branch -d ${branchName}`, { stdio: [0, 1, 2] });
+        return false;
+    }
+
+    child_process.execSync('git -C tempRN pull', { stdio: [0, 1, 2] });
+
+    removeSubtreeAddSubmodule('Folly');
+
+    removeSubtreeAddSubmodule('double-conversion');
+
+    removeSubtreeAddSubmodule('glog');
+
+    removeSubtreeAddSubmodule('jsc');
+
+    removeSubtreeAddSubmodule('v8');
+
+    // no change
+    if (child_process.execSync('git -C tempRN status --porcelain').toString().trim().length === 0) {
+        console.log('No change happens, no need to create pull request');
+
+        child_process.execSync(`git -C tempRN push -d origin ${branchName}`, { stdio: [0, 1, 2] });
+
+        return false;
+    }
+
+    try {
+        child_process.execSync(`git -C tempRN commit -m "${pullRequestTitle}"`, { stdio: [0, 1, 2] });
+    }
+    catch (e) {
+    }
+
+    child_process.execSync(`git -C tempRN push origin ${branchName}`, { stdio: [0, 1, 2] });
+    return true;
+}
+
+const AutoSync = require('./autoSync.js');
+const autoSync = new AutoSync(vsoRepoID, vsoApiUrl, myToken);
+
+//clean the possible temporary local git repo before we start sync
+child_process.execSync('IF EXIST tempRN rd /s /q tempRN', { stdio: [0, 1, 2] });
+child_process.execSync('IF EXIST tempSDX rd /s /q tempSDX', { stdio: [0, 1, 2] });
+
+let checkBranch = child_process.execSync(`git ls-remote --heads ${ISSUrl}react-native ${branchName} | wc -l`).toString();
+if (checkBranch.trim() === '1') {
+    console.log('pull request already exists, completes the pull request when all builds success');
+    autoSync.completePrWhenAllBuildsSuccess(pullRequestTitle);
+}
+else {
+    let shouldCreatePr = syncRepo();
+
+    if (shouldCreatePr) {
+        console.log('There are changes, create pull request');
+        autoSync.createPr(branchName, pullRequestTitle, pullRequestDescription);
+    }
+
+    //clean the possible temporary local git repo after the pull request
+    child_process.execSync('IF EXIST tempRN rd /s /q tempRN', { stdio: [0, 1, 2] });
+    child_process.execSync('IF EXIST tempSDX rd /s /q tempSDX', { stdio: [0, 1, 2] });
+}
