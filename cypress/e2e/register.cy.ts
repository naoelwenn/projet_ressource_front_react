/*describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})*/
describe('Test inscription', () => {
  it('Inscription avec des valeurs valides', () => {
    cy.visit('http://localhost:8081/');

    // Cliquer sur le bouton "Connexion"
    cy.contains('Inscription').click();

    // Saisir l'email
    cy.get('input[type="email"]').type('monmail@mail.com');

    // Saisir le mot de passe
    cy.get('input[type="password"]').type('monUtilisateur1');

    //Saisir le pseudo
    cy.get('[data-testid="pseudoInput"]').type('UserNumero1');

    //Saisir la ville
    cy.get('[data-testid="villeInput"]').type('Paris');

    //Saisir le code postal
     cy.get('[data-testid="cpInput"]').type('75000');

     //Saisir l'année de naissance
     cy.get('[data-testid="birthdayInput"]').type('1980');

     //Cliquer sur l'état civil Femme
     cy.contains('Femme').click();

     //Cliquer su se connecter
     cy.contains('S\'inscrire').click();
    });
    it('toutes les valeurs sont refusées pour voir les messages d\'erreur', ()=> {
          cy.visit('http://localhost:8081/');

    // Cliquer sur le bouton "Connexion"
    cy.contains('Inscription').click();

    // Saisir l'email
    cy.get('input[type="email"]').type('monmailail.com');

    // Saisir le mot de passe
    cy.get('input[type="password"]').type('mon');

    //Saisir le pseudo
    cy.get('[data-testid="pseudoInput"]').type('<>');

    //Saisir la ville
    cy.get('[data-testid="villeInput"]').type('Triebiliniakistanivopoloviych');

    //Saisir le code postal
     cy.get('[data-testid="cpInput"]').type('96');

     //Saisir l'année de naissance
     cy.get('[data-testid="birthdayInput"]').type('50');

     //Cliquer sur l'état civil Femme
     cy.contains('Femme').click();

     //Cliquer su se connecter
     cy.contains('S\'inscrire').click();
    })
  })