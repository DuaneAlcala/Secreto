/*
 * Stores information for a user object.
 */
export class User {
  constructor(localId, email, idToken, expiresIn, destinationsId, opinionsId) {
    this.localId = localId;
    this.email = email;
    this.idToken = idToken;
    this.expiresIn = expiresIn;
    this.destinationsId = destinationsId;
    this.opinionsId = opinionsId;
  }
}
