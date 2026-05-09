describe('Zadanie 6 - Testy Logowania (SauceDemo)', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  it('1. Logowanie z poprawnymi danymi', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('be.visible');
    cy.get('.title').should('contain', 'Products');
    cy.get('.shopping_cart_link').should('exist');
  });

  it('2. Logowanie z błędnym hasłem', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('wrong_password');
    cy.get('#login-button').click();
    
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain', 'Username and password do not match');
    cy.get('#login-button').should('be.visible');
  });

  it('3. Próba logowania z pustymi polami', () => {
    cy.get('#login-button').click();
    
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain', 'Username is required');
    cy.get('svg.error_icon').should('have.length', 2);
  });
});

describe('Zadanie 6 - Testy Sklepu (SauceDemo)', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('4. Widoczność listy produktów', () => {
    cy.get('.inventory_list').should('be.visible');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
    cy.get('.inventory_item_name').first().should('be.visible');
  });

  it('5. Sortowanie produktów (Z-A)', () => {
    cy.get('[data-test="product-sort-container"]').select('za');
    
    cy.get('.active_option').should('contain', 'Name (Z to A)');
    cy.get('.inventory_item_name').first().should('contain', 'Test.allTheThings() T-Shirt (Red)');
  });

  it('6. Sortowanie po cenie (Low to High)', () => {
    cy.get('[data-test="product-sort-container"]').select('lohi');
    
    cy.get('.active_option').should('contain', 'Price (low to high)');
    cy.get('.inventory_item_name').first().should('contain', 'Sauce Labs Onesie');
  });

  it('7. Dodanie produktu do koszyka', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    cy.get('.shopping_cart_badge').should('be.visible');
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
  });

  it('8. Usunięcie produktu z poziomu listy głównej', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    
    cy.get('.shopping_cart_badge').should('not.exist');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  });

  it('9. Nawigacja do koszyka', () => {
    cy.get('.shopping_cart_link').click();
    
    cy.url().should('include', '/cart.html');
    cy.get('.title').should('contain', 'Your Cart');
  });

  it('10. Widok szczegółów produktu', () => {
    cy.get('.inventory_item_name').first().click();
    
    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('be.visible');
    cy.get('.inventory_details_price').should('be.visible');
    cy.get('[data-test="back-to-products"]').should('exist');
  });

  it('11. Powrót ze szczegółów produktu do listy', () => {
    cy.get('.inventory_item_name').first().click();
    cy.get('[data-test="back-to-products"]').click();
    
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_list').should('be.visible');
  });

  it('12. Usunięcie produktu będąc wewnątrz koszyka', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    
    cy.get('.cart_item').should('be.visible');
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('.cart_item').should('not.exist');
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('13. Przejście do pierwszego kroku zamówienia (Checkout 1)', () => {
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('.title').should('contain', 'Checkout: Your Information');
  });

  it('14. Walidacja formularza Checkout (puste dane)', () => {
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();
    
    cy.get('[data-test="error"]').should('be.visible');
    cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');
  });

  it('15. Przejście do drugiego kroku zamówienia (Checkout 2)', () => {
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Jan');
    cy.get('[data-test="lastName"]').type('Kowalski');
    cy.get('[data-test="postalCode"]').type('00-000');
    cy.get('[data-test="continue"]').click();
    
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.summary_info').should('be.visible');
    cy.get('.summary_subtotal_label').should('exist');
  });

  it('16. Finalizacja zamówienia (Finish)', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Jan');
    cy.get('[data-test="lastName"]').type('Kowalski');
    cy.get('[data-test="postalCode"]').type('00-000');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('be.visible');
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
    cy.get('[data-test="back-to-products"]').should('be.visible');
  });

  it('17. Resetowanie stanu aplikacji z menu', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('#react-burger-menu-btn').click();
    cy.get('#reset_sidebar_link').click();
    
    cy.reload();
    
    cy.get('.shopping_cart_badge').should('not.exist');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  });

  it('18. Wylogowanie użytkownika', () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').click();
    
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#login-button').should('be.visible');
    cy.get('#user-name').should('have.value', '');
  });

  it('19. Link do profilu Twitter w stopce', () => {
    cy.get('.footer').should('be.visible');
    cy.get('.social_twitter a').should('exist');
    cy.get('.social_twitter a').should('have.attr', 'href').and('include', 'twitter.com');
  });

  it('20. Link do profilu LinkedIn w stopce z otwieraniem w nowej karcie', () => {
    cy.get('.social_linkedin a').should('exist');
    cy.get('.social_linkedin a').should('have.attr', 'target', '_blank');
    cy.get('.social_linkedin a').should('have.attr', 'href').and('include', 'linkedin.com');
  });

});