describe("Register Form", () => {
    beforeEach(() => {
        cy.visit("/register"); // pastikan URL ini sesuai dengan rute halaman register Anda
    });

    it("should render the register form", () => {
        // Memastikan elemen form muncul di halaman
        cy.get("h1").should("contain.text", "Register");
        cy.get("form").should("be.visible");
        cy.get("input[name='name']").should("be.visible");
        cy.get("input[name='email']").should("be.visible");
        cy.get("input[name='password']").should("be.visible");
        cy.get("select[name='role']").should("be.visible");
        cy.get("button[type='submit']").should("contain.text", "Register");
    });

    it("should show validation error when submitting with invalid data", () => {
        cy.get("input[name='name']").type("Jo");
        cy.get("input[name='email']").type("invalid-email");
        cy.get("input[name='password']").type("123");
        cy.get("select[name='role']").select("ORGANIZER");

        cy.get("button[type='submit']").click();

        // Memeriksa apakah error muncul di form
        cy.get(".text-red-500").should("have.length", 3); // Menghitung ada berapa error validasi
    });

    it("should submit the form successfully with valid data", () => {
        // Memasukkan data yang valid
        cy.get("input[name='name']").type("John Doe");
        cy.get("input[name='email']").type("john@example.com");
        cy.get("input[name='password']").type("Test@1234");
        cy.get("select[name='role']").select("ATTENDEE");

        // Memastikan form dikirim
        cy.intercept("POST", "/auth/regis", {
            statusCode: 201,
            body: {
                message: "Registrasi berhasil",
            },
        }).as("registerRequest");

        cy.get("button[type='submit']").click();

        // Memastikan permintaan POST terkirim
        cy.wait("@registerRequest");

        // Memastikan Swal berhasil muncul
        cy.get(".swal2-popup").should("contain.text", "Registrasi berhasil");

        // Cek apakah redirection berhasil
        cy.url().should("eq", "http://localhost:3000/"); // URL yang sesuai setelah redirect
    });

    it("should show error message if registration fails", () => {
        // Memasukkan data yang valid
        cy.get("input[name='name']").type("John Doe");
        cy.get("input[name='email']").type("john@example.com");
        cy.get("input[name='password']").type("Test@1234");
        cy.get("select[name='role']").select("ATTENDEE");

        // Memastikan form gagal dengan intercept error response
        cy.intercept("POST", "/auth/regis", {
            statusCode: 500,
            body: {
                message: "Registrasi gagal",
            },
        }).as("registerRequest");

        cy.get("button[type='submit']").click();

        // Memastikan permintaan POST terkirim
        cy.wait("@registerRequest");

        // Memastikan error muncul
        cy.get(".swal2-popup").should("contain.text", "Registrasi gagal");
    });
});