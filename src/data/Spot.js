/*
 * Stores information about each spot.
 */
export class Spot {
  constructor(name, information, address, area, country, image, latitude, longitude, id, userId, likes, dislikes, comments) {
    this.name = name;
    this.information = information;
    this.address = address;
    this.area = area;
    this.country = country;
    this.image = image;
    this.latitude = latitude;
    this.longitude = longitude;
    this.id = id;
    this.userId = userId;
    this.likes = likes;
    this.dislikes = dislikes;
    this.comments = comments;
  }
}
