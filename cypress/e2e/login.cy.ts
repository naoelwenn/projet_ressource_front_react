describe('Test de connexion', () => {
  it('Se connecte avec des identifiants valides', () => {
    cy.visit('http://localhost:8081/Login/');

    // Cliquer sur le bouton "Connexion"
    cy.contains('Connexion').click();

    // Saisir l'email
    cy.get('input[name="Email"]').type('utilisateur3000@mail.com');

    // Saisir le mot de passe
    cy.get('input[name="Mot de Passe"]').type('Utilisateur3000');

    // Cliquer sur le bouton "Se connecter"
    cy.contains('Se connecter').click();


  });
});
