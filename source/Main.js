// ==UserScript==
// @name         BaiduSharePage
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  ��סAlt��ѡ�ж������ش����ݽ����Ӧ����ҳ��Press Alt on keyboard and Select a baidu_secret_code to enter target share page��
// @author       Kakami
// @match        *://*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @note         v0.2.5 ȥ�����ֲ�֧�ֵ�(?<=exp),��Ϊ(?=exp)����
// @note         v0.2.4 ���������������ȶ���
// @note         v0.2.4 �»���_�Ͷ̺���-������ĳЩ������ж�Ϊ����Ч�ַ���
// @note         v0.2.3 ��ӽ��û��и�������Ľ������
// @note         v0.2.2 ���һ������Ľ���������磺1ssssssGf ����2:1234 ��12345678 ����b��1234 �������ش�������ȡ��֮�京�������������ֻ���ĸ����Ϊ����Ч�ַ���ʵ��������Ч�ַ���
// @note         v0.2.2 ���һ������Ľ���������磺1c347Cx6     c34f �������ش������ȡ��֮����ÿո����
// @note         v0.2 ����Զ����ѡ�е���ȡ�빦��
// @note         v0.1 ��ɻ�������
// ==/UserScript==

(function () {
    'use strict';
    //�Զ�����Ҫ���µİ���
    function isOnKeyDown(e) {
        //��Alt��
        if (!e.altKey) return;
        //��Ctrl��
        //if(!e.ctrlKey)return;
        //��Shift��
        //if(!e.shiftKey)return;

        //����
        openSharePage(e);
    }

    //������
    document.addEventListener('mouseup', isOnKeyDown, false);
    isInSharePage();

    //�򿪷���ҳ�ĺ���
    function openSharePage(e) {
        var ae = document.activeElement;
        var currentString = "";
        var sharePassword = "";
        //��ȡѡ�е��ı�
        if (ae.tagName.toLowerCase() == "input" || ae.tagName.toLowerCase() == "textarea") {
            currentString = ae.value.substring(ae.selectionStart, ae.selectionEnd);
        } else {
            currentString = document.getSelection().toString();
        }
        var reg = "[^a-zA-Z0-9_-]+";
        var reg2 = ".*(��|:|��|ȡ).*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*";
        var reg3 = ".*[^0-9a-zA-Z_-][2bB](:|��|,|��|\s).*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*";

        //ȥ�������ַ�
        currentString = currentString.replace(/(?=����).*(?=����)/gm, "");
        var shareString = currentString.replace(new RegExp(reg, "gm"), "");
        //�ж���û��ȡ��
        if (currentString.match(new RegExp(reg2, "g"))) {
            sharePassword = shareString.substr(-4, 4);
            shareString = shareString.replace(/[0-9a-zA-Z]{4}$/g, "");
            if (currentString.match(new RegExp(reg3, "g"))) {
                shareString = shareString.replace(/.$/g, "");
            }
            shareString = shareString + "#" + sharePassword;
        } else {
            //����code space
            //�ж���û��֤�루���������
            var currentString2 = currentString.replace(/[^\s,��0-9a-zA-Z_-]/gm, "");
            if (currentString2.match(/[\s,��0-9a-zA-Z_-]{8,40}[\s,��]+[0-9a-zA-Z]{4}/g)) {
                //shareString = shareString.replace(/[\s,��]/gm,"");
                sharePassword = shareString.substr(-4, 4);
                shareString = shareString.replace(/[0-9a-zA-Z]{4}$/g, "");
                if (currentString2.match(/[^0-9a-zA-Z_-][2bB][\s,��]+[0-9a-zA-Z]{4}$/g)) shareString = shareString.replace(/.$/g, "");
                shareString = shareString + "#" + sharePassword;
            }
        }
        if (shareString.length <= 18) shareString = shareString.replace(/[_-]/gm, "");
        //������ҳ��
        var shareUrl = "http://pan.baidu.com/s/" + shareString;
        if (shareString.length >= 4 && shareString.length < 50) {
            //console.log(shareUrl);
            //console.log(shareString);
            //console.log(sharePassword);
            window.open(shareUrl);
        }
    }

    //�Զ���д��ȡ��
    function isInSharePage(e) {
        var curl = location.href.toString();
        //console.log(curl);
        if (!curl.match(/.*baidu.*share.*#[0-9a-zA-Z]{4}$/g)) return;
        var Password = curl.substr(-4, 4);
        //console.log(Password);
        $(":input").val(Password);
        $(".g-button-right :contains('��ȡ�ļ�')").click();
    }
})();