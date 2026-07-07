"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".nav-list a");
    const currentYearEl = document.getElementById("current-year");

   // ローディングマスク制御（即時実行に変えて確実に消す）
    const loading = document.querySelector(".loading");
    if (loading) {
        loading.classList.add("hide");
        loading.setAttribute("aria-busy", "false");
    }

    // モバイルメニューのアクセシビリティ動的状態管理
    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
            hamburger.setAttribute("aria-label", isExpanded ? "メニューを開く" : "メニューを閉じる");
            nav.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "メニューを開く");
                nav.classList.remove("active");
            });
        });
    }

    // パッシブイベントによるヘッダースクロールクラス適用
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }, { passive: true });

    // スクロールフェードイン (Intersection Observer)
    const fadeElements = document.querySelectorAll(".section");
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => {
        el.classList.add("fade-up");
        fadeObserver.observe(el);
    });

    // フォームバリデーションロジック (DADSガイドライン準拠)
    const form = document.getElementById("reservationForm");

    if (form) {
        const inputs = form.querySelectorAll("input[required], select[required]");

        const validateInput = (input) => {
            const errorEl = document.getElementById(`error-${input.id}`);
            if (!errorEl) return true;

            if (!input.validity.valid) {
                input.classList.add("invalid");
                errorEl.classList.add("active");

                if (input.validity.valueMissing) {
                    errorEl.textContent = "この項目は入力必須です。";
                } else if (input.validity.typeMismatch && input.id === "email") {
                    errorEl.textContent = "有効なメールアドレスを入力してください。";
                } else {
                    errorEl.textContent = "入力内容に誤りがあります。";
                }
                return false;
            } else {
                input.classList.remove("invalid");
                errorEl.classList.remove("active");
                errorEl.textContent = "";
                return true;
            }
        };

        inputs.forEach(input => {
            input.addEventListener("blur", () => validateInput(input));
            input.addEventListener("input", () => {
                if (input.classList.contains("invalid")) {
                    validateInput(input);
                }
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let isAllValid = true;

            inputs.forEach(input => {
                const isValid = validateInput(input);
                if (!isValid) isAllValid = false;
            });

            if (!isAllValid) {
                const firstInvalid = form.querySelector(".invalid");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            alert(
`ご予約ありがとうございました。
送信内容を正常に受け付けました。

※こちらはデジタル庁デザインシステムに準拠したポートフォリオ用のデモ画面です。`
            );
            form.reset();
        });
    }

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});
JAVASCRIPT(旅館)script.js
5 KB
