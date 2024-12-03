// cypress/support/index.js

// declare global {
//     namespace Cypress {
//         interface Chainable {
//             login(email: string, password: string): Chainable<any>;
//         }
//     }
// }
// // -- This is a parent command --
// Cypress.Commands.add('login', (email: string, password: string) => {
//     cy.visit("/login");
//     cy.get('input[name="email"]').type(email);
//     cy.get('input[name="password"]').type(password);
//     cy.get('form').submit();
// })

// // Hook global untuk menangani error yang tidak tertangani
// Cypress.on('uncaught:exception', (err, runnable) => {
//     // Mengabaikan error yang mungkin tidak relevan untuk tes
//     return false;
// });

