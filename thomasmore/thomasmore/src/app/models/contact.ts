export class Contact {
  id: number;
  name: string;
  street: string;
  number: string;
  postal: string;
  city: string;
  email: string;

  constructor(name, street, number, postal, city, email) {
    this.name = name;
    this.street = street;
    this.number = number;
    this.postal = postal;
    this.city = city;
    this.email = email;
  }
}
