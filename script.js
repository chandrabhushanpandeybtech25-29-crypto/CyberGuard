document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. PASSWORD STRENGTH CHECKER
    // ==========================================

    const passwordInput = document.getElementById("password");
    const checkButton = document.getElementById("checkPassword");
    const toggleButton = document.getElementById("togglePassword");
    const strengthBar = document.getElementById("strengthBar");
    const strengthResult = document.getElementById("strengthResult");
    const strengthFeedback = document.getElementById("strengthFeedback");

    if (
        passwordInput &&
        checkButton &&
        toggleButton &&
        strengthBar &&
        strengthResult &&
        strengthFeedback
    ) {

        toggleButton.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                toggleButton.textContent = "Hide";
            } else {
                passwordInput.type = "password";
                toggleButton.textContent = "Show";
            }
        });

        checkButton.addEventListener("click", function () {
            const password = passwordInput.value;

            if (password.length === 0) {
                strengthResult.textContent = "Strength: Not checked";
                strengthFeedback.textContent =
                    "Please enter a sample password.";
                strengthBar.style.width = "0%";
                return;
            }

            let score = 0;
            const suggestions = [];

            if (password.length >= 12) {
                score++;
            } else {
                suggestions.push("Use at least 12 characters.");
            }

            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
                score++;
            } else {
                suggestions.push(
                    "Mix uppercase and lowercase letters."
                );
            }

            if (/[0-9]/.test(password)) {
                score++;
            } else {
                suggestions.push("Consider including numbers.");
            }

            if (/[^A-Za-z0-9]/.test(password)) {
                score++;
            } else {
                suggestions.push("Consider including symbols.");
            }

            let strength;
            let percentage;

            if (score <= 1) {
                strength = "Weak";
                percentage = 25;
            } else if (score === 2) {
                strength = "Fair";
                percentage = 50;
            } else if (score === 3) {
                strength = "Good";
                percentage = 75;
            } else {
                strength = "Strong";
                percentage = 100;
            }

            strengthResult.textContent = "Strength: " + strength;
            strengthBar.style.width = percentage + "%";

            strengthFeedback.textContent = suggestions.length > 0
                ? suggestions.join(" ")
                : "Your password meets all four checks, but this does not guarantee security.";
        });
    }


    // ==========================================
    // 2. URL SAFETY CHECKER
    // ==========================================

    const urlInput = document.getElementById("urlInput");
    const checkURLButton = document.getElementById("checkURL");
    const urlResult = document.getElementById("urlResult");
    const urlFeedback = document.getElementById("urlFeedback");

    if (urlInput && checkURLButton && urlResult && urlFeedback) {

        checkURLButton.addEventListener("click", function () {
            const value = urlInput.value.trim();

            if (!value) {
                urlResult.textContent = "Result: No URL entered";
                urlFeedback.textContent =
                    "Please enter a website address.";
                return;
            }

            let parsedURL;

            try {
                const address = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)
                    ? value
                    : "https://" + value;

                parsedURL = new URL(address);

                if (
                    !["http:", "https:"].includes(parsedURL.protocol) ||
                    !parsedURL.hostname
                ) {
                    throw new Error("Invalid website address");
                }

            } catch (error) {
                urlResult.textContent = "Result: Invalid URL";
                urlFeedback.textContent =
                    "Enter a valid HTTP or HTTPS website address.";
                return;
            }

            const hostname = parsedURL.hostname.toLowerCase();
            const warnings = [];

            if (parsedURL.protocol !== "https:") {
                warnings.push("The link does not use HTTPS.");
            }

            if (hostname.includes("xn--")) {
                warnings.push(
                    "The domain uses encoded characters that may disguise its appearance."
                );
            }

            if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
                warnings.push(
                    "The link uses an IP address instead of a domain name."
                );
            }

            if (parsedURL.username || parsedURL.password) {
                warnings.push(
                    "The address contains text resembling login information."
                );
            }

            if (hostname.split(".").length >= 5) {
                warnings.push(
                    "The domain has many subdomains. Check it carefully."
                );
            }

            if (/@/.test(value)) {
                warnings.push(
                    "The address contains an @ symbol. Check the actual destination."
                );
            }

            if (warnings.length > 0) {
                urlResult.textContent = "Result: Caution";
                urlFeedback.textContent = warnings.join(" ");
            } else {
                urlResult.textContent =
                    "Result: No obvious warning signs";

                urlFeedback.textContent =
                    "This basic check found no listed warning signs. It does not prove the website is safe.";
            }
        });
    }


    // ==========================================
    // 3. PHISHING MESSAGE DETECTOR
    // ==========================================

    const messageInput = document.getElementById("messageInput");
    const checkMessageButton = document.getElementById("checkMessage");
    const phishingResult = document.getElementById("phishingResult");
    const phishingFeedback = document.getElementById("phishingFeedback");

    if (
        messageInput &&
        checkMessageButton &&
        phishingResult &&
        phishingFeedback
    ) {

        checkMessageButton.addEventListener("click", function () {
            const message = messageInput.value.trim();

            if (!message) {
                phishingResult.textContent =
                    "Result: No message entered";

                phishingFeedback.textContent =
                    "Please paste a message to analyze.";
                return;
            }

            const lowerMessage = message.toLowerCase();
            const warnings = [];

            const urgencyWords = [
                "urgent",
                "immediately",
                "act now",
                "limited time",
                "account suspended",
                "account blocked",
                "verify now"
            ];

            const sensitiveWords = [
                "password",
                "otp",
                "one-time password",
                "pin",
                "bank details",
                "credit card",
                "cvv"
            ];

            const rewardWords = [
                "you won",
                "winner",
                "claim your prize",
                "free gift",
                "lottery",
                "cash reward"
            ];

            if (urgencyWords.some(word => lowerMessage.includes(word))) {
                warnings.push(
                    "The message creates urgency or threatens account restrictions."
                );
            }

            if (sensitiveWords.some(word => lowerMessage.includes(word))) {
                warnings.push(
                    "The message mentions sensitive credentials or financial information."
                );
            }

            if (rewardWords.some(word => lowerMessage.includes(word))) {
                warnings.push(
                    "The message makes a reward or prize claim."
                );
            }

            if (/(https?:\/\/|www\.)/i.test(message)) {
                warnings.push(
                    "The message contains a web link. Check its destination carefully."
                );
            }

            if (
                lowerMessage.includes("send otp") ||
                lowerMessage.includes("share your otp") ||
                lowerMessage.includes("tell me your password")
            ) {
                warnings.push(
                    "The message appears to request sensitive authentication information."
                );
            }

            if (warnings.length >= 3) {
                phishingResult.textContent = "Result: High Suspicion";
            } else if (warnings.length >= 1) {
                phishingResult.textContent = "Result: Be Careful";
            } else {
                phishingResult.textContent =
                    "Result: No Obvious Warning Signs";
            }

            phishingFeedback.textContent = warnings.length > 0
                ? warnings.join(" ")
                : "No listed warning patterns were found. This does not prove the message is genuine.";
        });
    }


    // ==========================================
    // 4. PRIVACY CHECKER
    // ==========================================

    const privacyInput = document.getElementById("privacyInput");
    const checkPrivacyButton = document.getElementById("checkPrivacy");
    const privacyResult = document.getElementById("privacyResult");
    const privacyFindings = document.getElementById("privacyFindings");

    if (
        privacyInput &&
        checkPrivacyButton &&
        privacyResult &&
        privacyFindings
    ) {

        checkPrivacyButton.addEventListener("click", function () {
            const text = privacyInput.value;

            privacyFindings.replaceChildren();

            if (!text.trim()) {
                privacyResult.textContent = "Result: No text entered";

                const item = document.createElement("li");
                item.textContent = "Enter some sample text to check.";
                privacyFindings.appendChild(item);
                return;
            }

            const findings = [];

            // Possible email address
            if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) {
                findings.push("Possible email address detected.");
            }

            // Possible Indian mobile number
            if (/(?:\+91[\s-]?)?[6-9]\d{9}\b/.test(text)) {
                findings.push("Possible Indian mobile number detected.");
            }

            // Possible 12-digit identification number
            // This does NOT validate Aadhaar.
            if (/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(text)) {
                findings.push(
                    "Possible 12-digit identification number detected. This does not verify Aadhaar."
                );
            }

            // Possible 16-digit payment card number
            // This does NOT validate a payment card.
            if (/\b(?:\d[ -]?){15}\d\b/.test(text)) {
                findings.push(
                    "Possible 16-digit payment card number detected. This does not validate a card."
                );
            }

            // References to passwords, PINs, or OTPs
            if (/\b(password|passcode|otp|one[- ]time password|pin)\b/i.test(text)) {
                findings.push(
                    "The text mentions a password, PIN, or OTP. Never share authentication codes."
                );
            }

            if (findings.length === 0) {
                privacyResult.textContent =
                    "Result: No common sensitive patterns found";

                const item = document.createElement("li");

                item.textContent =
                    "No patterns covered by this checker were detected. Other sensitive information may still be present.";

                privacyFindings.appendChild(item);

            } else {
                privacyResult.textContent =
                    "Result: " + findings.length + " potential warning(s)";

                findings.forEach(function (finding) {
                    const item = document.createElement("li");
                    item.textContent = finding;
                    privacyFindings.appendChild(item);
                });
            }
        });
    }


    // ==========================================
    // 5. QR CODE SCANNER
    // ==========================================

    const qrImage = document.getElementById("qrImage");
    const scanQR = document.getElementById("scanQR");
    const qrResult = document.getElementById("qrResult");

    if (qrImage && scanQR && qrResult) {

        scanQR.addEventListener("click", function () {
            const file = qrImage.files[0];

            if (!file) {
                qrResult.textContent =
                    "Please select a QR code image first.";
                return;
            }

            if (!file.type.startsWith("image/")) {
                qrResult.textContent =
                    "Please select a valid image file.";
                return;
            }

            if (typeof jsQR === "undefined") {
                qrResult.textContent =
                    "QR scanner library could not load. Check your internet connection.";
                return;
            }

            qrResult.textContent = "Scanning QR code...";

            const reader = new FileReader();

            reader.onload = function (event) {
                const img = new Image();

                img.onload = function () {
                    try {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");

                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;

                        context.drawImage(img, 0, 0);

                        const imageData = context.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                        const code = jsQR(
                            imageData.data,
                            imageData.width,
                            imageData.height
                        );

                        if (!code) {
                            qrResult.textContent =
                                "No QR code detected. Try a clearer image.";
                            return;
                        }

                        const content = code.data;

                        qrResult.replaceChildren();

                        const heading = document.createElement("p");
                        heading.textContent = "QR code content:";
                        qrResult.appendChild(heading);

                        const output = document.createElement("p");
                        output.textContent = content;
                        qrResult.appendChild(output);

                        let parsedURL;

                        try {
                            parsedURL = new URL(content);
                        } catch (error) {
                            parsedURL = null;
                        }

                        if (
                            parsedURL &&
                            ["http:", "https:"].includes(parsedURL.protocol)
                        ) {
                            const warning = document.createElement("p");

                            warning.textContent =
                                "Caution: Inspect the domain carefully. This scanner cannot confirm whether the website is safe.";

                            qrResult.appendChild(warning);

                            const link = document.createElement("a");

                            link.href = parsedURL.href;
                            link.textContent =
                                "Open link (only if you trust it)";
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";

                            qrResult.appendChild(link);

                        } else {
                            const warning = document.createElement("p");

                            warning.textContent =
                                "This QR code contains text or a non-standard web address. Check it before using it.";

                            qrResult.appendChild(warning);
                        }

                    } catch (error) {
                        qrResult.textContent =
                            "Could not process this image. Please try another QR code image.";
                    }
                };

                img.onerror = function () {
                    qrResult.textContent =
                        "Could not read the selected image.";
                };

                img.src = event.target.result;
            };

            reader.onerror = function () {
                qrResult.textContent =
                    "Could not load the selected file.";
            };

            reader.readAsDataURL(file);
        });
    }

});