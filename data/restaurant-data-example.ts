export const RESTAURANT_DATA = {
  botnaam: 'FriturieBot',
  restaurant: 'De Friturie',
  contact: {
    telefoon: '011 96 37 23',
    website: 'www.defriturie.be',
  },
  openingstijden: {
    maandag_dinsdag: '16:30 - 21:00',
    woensdag_zondag: '11:30 - 13:30 | 16:30 - 21:00',
  },
  menukaart: {
    frieten: [
      { naam: 'Baby friet', prijs: 2.9 },
      { naam: 'Kleine friet', prijs: 3.3 },
      {
        naam: 'Julienke',
        prijs: 10.0,
        omschrijving: 'Friet met stoofvleessaus, bicky ajuin, stukjes viandel',
      },
      { naam: 'Spicy Julienke', prijs: 11.0, labels: ['pittig'] },
    ],
    beefburgers: [
      {
        naam: 'Classic Beef Burger',
        prijs: 9.5,
        ingrediënten: [
          'rustiek broodje',
          'sla',
          'tomaat',
          'augurk',
          'rode ajuin',
          'ketchup',
          'mosterd',
        ],
      },
      {
        naam: 'Smokey Bacon Beef Burger',
        prijs: 11.0,
        ingrediënten: ['spek', 'cheddar', 'smokey BBQ saus'],
      },
    ],
    bicky_burgers: [
      { id: 'b1', naam: 'Bicky Crispy Burger', prijs: 4.4 },
      { id: 'b2', naam: 'Bicky VEGI', prijs: 5.5, labels: ['vegetarisch'] },
    ],
    warme_broodjes: [
      { naam: 'Broodje Mexicano', prijs: 5.8 },
      { naam: 'Broodje VEGI kipcorn', prijs: 6.2, labels: ['vegetarisch'] },
    ],
    snacks_vegi: [
      { naam: 'Kaaskroket', prijs: 3.0, labels: ['vegetarisch'] },
      { naam: 'VEGI Vlammetjes', prijs: 3.0, labels: ['vegetarisch', 'pittig'] },
      { naam: 'Nacho cheese Bites', prijs: 3.2, labels: ['vegetarisch'] },
    ],
    snacks_glutenvrij: [
      { naam: 'Glutenvrije kipnuggets', prijs: 4.1, labels: ['glutenvrij'] },
      { naam: 'Glutenvrije vleeskroket', prijs: 3.6, labels: ['glutenvrij'] },
      { naam: 'Glutenvrije frikandel', prijs: 3.3, labels: ['glutenvrij'] },
    ],
  },
  belangrijke_info: {
    allergenen: 'Informatie over allergenen is opvraagbaar bij het personeel.',
    betaling: ['Contant', 'Bancontact', 'PayConic', 'Maaltijdcheques'],
  },
};
