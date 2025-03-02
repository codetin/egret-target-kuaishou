
var cp = require('child_process');
var fs = require('fs');

var targetJsonPath = "./target/target.json";
var targetJson = JSON.parse(fs.readFileSync(targetJsonPath, { encoding }));

var commands = process.argv.slice(2);
var version
if (commands.length != 1) {
    version = targetJson.version;
    console.log("没有输入版本号，使用默认版本号:", version);
} else {
    version = commands[0];
}

targetJson.version = version;
fs.writeFileSync(targetJsonPath, JSON.stringify(targetJson, undefined, "\t"));

var encoding = "utf8";
var exe = cp.exec("egret build", function () {
    var jsPath = "./target/template/egret.kuaishou.js";
    var content = fs.readFileSync(jsPath, { encoding });
    content = content.replace(/var egret;/gi, "");
    var key = "kuaishou.version = \"";
    var index = content.indexOf(key);
    content = content.slice(0, index + key.length) + version + content.slice(index + key.length + 5);
    fs.writeFileSync(jsPath, content);
    fs.unlinkSync(jsPath.replace(".js", ".min.js"));
});

exe.stdout.on("data", function (data) {
    console.log(data);
});

exe.stderr.on("data", function (data) {
    console.log(data);
});