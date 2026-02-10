
exports.passwordChecker = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) 
        return { status: true, msg: "Mật khẩu mạnh!" };
    else 
        return { status: false, msg: "Mật khẩu chưa đủ mạnh. Cần ít nhất 8 ký tự, đủ chữ hoa, chữ thường, số và ký tự đặc biệt." };
}