describe('Test de connexion', () => {
  it('Se connecte avec des identifiants valides', () => {
    cy.visit('http://localhost:8081/');

    // Cliquer sur le bouton "Connexion"
    cy.contains('Connexion').click();

    // Saisir l'email
    cy.get('input[type="email"]').type('utilisateur3000@mail.com');

    // Saisir le mot de passe
    cy.get('input[type="password"]').type('Utilisateur3000');

    // Cliquer sur le bouton "Se connecter"
    cy.contains('Se connecter').click();

        cy.window().should('have.property', 'localStorage').then((localStorage) => {
      const userPseudo = localStorage.getItem('userPseudo');
      expect(userPseudo).to.not.be.null; // Vérifie que userPseudo n'est pas null
    });

  });
  it('Se connecte avec un email inconnu', () => {
        cy.visit('http://localhost:8081/');

    // Cliquer sur le bouton "Connexion"
    cy.contains('Connexion').click();
        // Remplir le formulaire avec un email et un mot de passe incorrects
    cy.get('input[type="email"]').type('utilisateur@inconnu.com');
    cy.get('input[type="password"]').type('mauvaismotdepasse');
     // Cliquer sur le bouton "Se connecter"
    cy.contains('Se connecter').click();
        // Vérifier que userPseudo n'est pas défini dans localStorage
    cy.window().should('have.property', 'localStorage').then((localStorage) => {
      const userPseudo = localStorage.getItem('userPseudo');
      expect(userPseudo).to.be.null; // Vérifie que userPseudo est nul (l'utilisateur n'est pas connecté)
    });
  })
});
