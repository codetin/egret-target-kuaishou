//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.kuaishou {
    if (DEBUG) {
        let logFuncs:Object;

        function setLogLevel(logType:string):void {
            if (logFuncs == null) {
                logFuncs = {
                    "error": console.error,
                    "debug": console.debug,
                    "warn": console.warn,
                    "info": console.info,
                    "log": console.log
                };
            }
            switch (logType) {
                case Logger.OFF:
                    console.error = function () {
                    };
                case Logger.ERROR:
                    console.warn = function () {
                    };
                case Logger.WARN:
                    console.info = function () {
                    };
                    console.log = function () {
                    };
                case Logger.INFO:
                    console.debug = function () {
                    };
                default :
                    break;
            }

            switch (logType) {
                case Logger.ALL:
                case Logger.DEBUG:
                    console.debug = logFuncs["debug"];
                case Logger.INFO:
                    console.log = logFuncs["log"];
                    console.info = logFuncs["info"];
                case Logger.WARN:
                    console.warn = logFuncs["warn"];
                case Logger.ERROR:
                    console.error = logFuncs["error"];
                default :
                    break;
            }
        }

        Object.defineProperty(Logger, "logLevel", {
            set: setLogLevel,
            enumerable: true,
            configurable: true
        });
    }
}