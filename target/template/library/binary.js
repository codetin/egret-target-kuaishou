const fileutil = require('./file-util');
const path = fileutil.path;
const fs = fileutil.fs;
const WXFS = ks.getFileSystemManager();

class BinaryProcessor {

    onLoadStart(host, resource) {
        const {
            root,
            url
        } = resource;

        return new Promise((resolve, reject) => {

            let xhrURL = url.indexOf('://') >= 0 ? url : root + url;
            if (RES['getVirtualUrl']) {
                xhrURL = RES['getVirtualUrl'](xhrURL);
            }
            if (!path.isRemotePath(xhrURL)) {
                //本地加载
                try {
                    const content = WXFS.readFileSync(xhrURL);
                    resolve(content);
                } catch (e) {
                    resolve(null);
                }
                return;
            }
            if (needCache(xhrURL)) {
                //缓存加载
                const targetFilename = path.getLocalFilePath(xhrURL);
                if (fs.existsSync(targetFilename)) {
                    //缓存命中
                    let data = WXFS.readFileSync(path.getWxUserPath(targetFilename));
                    resolve(data);
                    return;
                }
                loadBinary(xhrURL).then((content) => {
                    //写入本地
                    const dirname = path.dirname(targetFilename);
                    fs.mkdirsSync(dirname);
                    fs.writeSync(targetFilename, content);
                    let needRead = needReadFile();
                    if (needRead) {
                        content = WXFS.readFileSync(path.getWxUserPath(targetFilename));
                    }
                    resolve(content);
                }).catch((e) => {
                    reject(e);
                });

            } else {
                //不用缓存直接加载
                loadBinary(xhrURL).then((content) => {
                    resolve(content);
                }).catch((e) => {
                    reject(e);
                });
            }
        });
    }

    onRemoveStart(host, resource) {
        return Promise.resolve();
    }
}

let wxSystemInfo;

function needReadFile() {
    if (!wxSystemInfo) {
        wxSystemInfo = ks.getSystemInfoSync();
    }
    let sdkVersion = wxSystemInfo.SDKVersion;
    let platform = wxSystemInfo.system.split(" ").shift();
    return (sdkVersion <= '2.2.3') && (platform == 'iOS');
}

function loadBinary(xhrURL) {
    return new Promise((resolve, reject) => {
        ks.request({
            url: xhrURL,
            method: 'get',
            responseType: 'arraybuffer',
            success: function success(_ref) {
                resolve(_ref.data)
            },
            fail: function fail(_ref2) {
                const error = new RES.ResourceManagerError(1001, xhrURL);
                console.error('load binary error', xhrURL);
                reject(error)
            }
        });
    });

}

/**
 * 由于微信小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(url) {
    if (url.indexOf("miniGame/resource/") >= 0) {
        return true;
    } else {
        return false;
    }
}

const processor = new BinaryProcessor();
RES.processor.map("bin", processor);
