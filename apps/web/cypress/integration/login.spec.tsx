import { mount } from "cypress/react";
import LoginForm from "@/views/loginView/components/loginForm"; // Pastikan path sesuai dengan file Anda

describe("LoginForm Integration", () => {
    it("should submit login form with valid credentials", () => {
        mount(<LoginForm />);

        // // Menggunakan custom command login
        // cy.login("user@example.com", "password123");

        // // Verifikasi setelah login, misalnya memeriksa apakah redirect berhasil
        // cy.url().should("include", "/dashboard");

        // Isi form dengan data yang valid
        cy.get('input[name="email"]').type("validuser@example.com");
        cy.get('input[name="password"]').type("validpassword123");

        // Kirimkan form
        cy.get('form').submit();

        // Periksa apakah ada pesan sukses atau aksi yang sesuai setelah login
        cy.contains("Login Successful").should("be.visible");
    });

    it("should show validation errors with invalid email format", () => {
        mount(<LoginForm />);

        // Isi form dengan email tidak valid
        cy.get('input[name="email"]').type("invalid-email");
        cy.get('input[name="password"]').type("validpassword123");

        // Kirimkan form
        cy.get('form').submit();

        // Periksa apakah ada pesan error
        cy.get(".text-red-500").should("contain.text", "Invalid format");
    });
});
