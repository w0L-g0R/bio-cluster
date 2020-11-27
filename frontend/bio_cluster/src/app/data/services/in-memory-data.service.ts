import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import _Agrarunternehmer from '../mocks/database/WKO/companies/Agrarunternehmer.json';
import _Bootbauer from '../mocks/database/WKO/companies/Bootbauer.json';
import _Briefumschlag_und_Papierausstattungsindustrie from '../mocks/database/WKO/companies/Briefumschlag_und_Papierausstattungsindustrie.json';
import _Büro_und_Organisationsmittelindustrie from '../mocks/database/WKO/companies/Büro_und_Organisationsmittelindustrie.json';
import _Bürsten_und_Pinselmacher from '../mocks/database/WKO/companies/Bürsten_und_Pinselmacher.json';
import _Drechsler from '../mocks/database/WKO/companies/Drechsler.json';
import _Einzelhandel_mit_Papier_Schreibwaren_und_Bürobedarf from '../mocks/database/WKO/companies/Einzelhandel_mit_Papier_Schreibwaren_und_Bürobedarf.json';
import _Einzelhandel_mit_Romane_Zeitschriften_und_Magazine from '../mocks/database/WKO/companies/Einzelhandel_mit_Romane_Zeitschriften_und_Magazine.json';
import _Energieholzindustrie from '../mocks/database/WKO/companies/Energieholzindustrie.json';
import _Faltschachtelindustrie from '../mocks/database/WKO/companies/Faltschachtelindustrie.json';
import _Floristen_Blumenbinder_und_Blumeneinzelhändler from '../mocks/database/WKO/companies/Floristen_Blumenbinder_und_Blumeneinzelhändler.json';
import _Forstunternehmer from '../mocks/database/WKO/companies/Forstunternehmer.json';
import _Friedhofsgärtner from '../mocks/database/WKO/companies/Friedhofsgärtner.json';
import _Gartenpflege_bzweingeschränkte_Gewerbeumfänge from '../mocks/database/WKO/companies/Gartenpflege_bzw_eingeschränkte_Gewerbeumfänge.json';
import _Gas_und_Sanitärtechnik from '../mocks/database/WKO/companies/Gaseinrichtungen_in_mobilen_Fahrzeugen_und_Anlagen.json';
import _Gaseinrichtungen_in_mobilen_Fahrzeugen_und_Anlagen from '../mocks/database/WKO/companies/Gastechniker.json';
import _Gastechniker from '../mocks/database/WKO/companies/Gasversorgungsunternehmen.json';
import _Gasversorgungsunternehmen from '../mocks/database/WKO/companies/Gas_und_Sanitärtechnik.json';
import _Großhandel_mit_Papier_Schreibwaren_und_Bürobedarf from '../mocks/database/WKO/companies/Großhandel_mit_Papier_Schreibwaren_und_Bürobedarf.json';
import _Großhandel_mit_Romanen_Zeitschriften_und_Magazinen from '../mocks/database/WKO/companies/Großhandel_mit_Romanen_Zeitschriften_und_Magazinen.json';
import _Großhandel_mit_Spielwaren from '../mocks/database/WKO/companies/Großhandel_mit_Spielwaren.json';
import _Handel_mit_festen_mineralischen_oder_biogenen_Brennstoffen from '../mocks/database/WKO/companies/Handel_mit_festen_mineralischen_oder_biogenen_Brennstoffen.json';
import _Handel_mit_Heizölen_und_Flüssiggas from '../mocks/database/WKO/companies/Handel_mit_Heizölen_und_Flüssiggas.json';
import _Handel_mit_Holz from '../mocks/database/WKO/companies/Handel_mit_Holz.json';
import _Handel_mit_Holzfabrikaten_und_Holzhäusern from '../mocks/database/WKO/companies/Handel_mit_Holzfabrikaten_und_Holzhäusern.json';
import _Handel_mit_Papier_Schreibwaren_und_Bürobedarf from '../mocks/database/WKO/companies/Handel_mit_Papier_Schreibwaren_und_Bürobedarf.json';
import _Handel_mit_Post_und_Ansichtskarten from '../mocks/database/WKO/companies/Handel_mit_Post_und_Ansichtskarten.json';
import _Handel_mit_sonstigen_Mineralölprodukten from '../mocks/database/WKO/companies/Handel_mit_sonstigen_Mineralölprodukten.json';
import _Handel_mit_Strom from '../mocks/database/WKO/companies/Handel_mit_Strom.json';
import _Heizungstechnik from '../mocks/database/WKO/companies/Heizungstechnik.json';
import _Herstellung_von_Dekorations_und_Festartikeln from '../mocks/database/WKO/companies/Herstellung_von_Dekorations_und_Festartikeln.json';
import _Herstellung_von_Etiketten_aller_Art from '../mocks/database/WKO/companies/Herstellung_von_Etiketten_aller_Art.json';
import _Herstellung_von_Spielkarten_und_anderer_Spielwaren_aller_Art from '../mocks/database/WKO/companies/Herstellung_von_Spielkarten_und_anderer_Spielwaren_aller_Art.json';
import _Hobelwarenindustrie from '../mocks/database/WKO/companies/Hobelwarenindustrie.json';
import _Hobelwerke from '../mocks/database/WKO/companies/Hobelwerke.json';
import _Holzbau_Meister from '../mocks/database/WKO/companies/Holzbaugewerbetreibender_eingeschr_auf_ausführende_Tät.json';
import _Holzbaugewerbetreibender_eingeschrauf_ausführende_Tät from '../mocks/database/WKO/companies/Holzbaugewerbetreibender_eingeschränkt_auf_Teilbereiche.json';
import _Holzbaugewerbetreibender_eingeschränkt_auf_Teilbereiche from '../mocks/database/WKO/companies/HolzbauMeister.json';
import _Holzgestalter from '../mocks/database/WKO/companies/Holzgestalter.json';
import _Holzhaus_und_Hallenbauindustrie from '../mocks/database/WKO/companies/Holzhaus_und_Hallenbauindustrie.json';
import _Holzimprägnier_und_veredelungsindustrie from '../mocks/database/WKO/companies/Holzimprägnier_und_veredelungsindustrie.json';
import _Holzschindelerzeuger from '../mocks/database/WKO/companies/Holzschindelerzeuger.json';
import _Holzverpackungs_und_packmittelindustrie from '../mocks/database/WKO/companies/Holzverpackungs_und_packmittelindustrie.json';
import _Holzwerkstoffindustrie from '../mocks/database/WKO/companies/Holzwerkstoffindustrie.json';
import _Holzzerkleinerer from '../mocks/database/WKO/companies/Holzzerkleinerer.json';
import _Industrie_flexibler_Verpackungen from '../mocks/database/WKO/companies/industrielle_Bautischlereien.json';
import _Industrie_hygienischer_Papierwaren from '../mocks/database/WKO/companies/Industrielle_Buchbindereien.json';
import _industrielle_Bautischlereien from '../mocks/database/WKO/companies/Industrie_flexibler_Verpackungen.json';
import _Industrielle_Buchbindereien from '../mocks/database/WKO/companies/Industrie_hygienischer_Papierwaren.json';
import _Kartonagenindustrie from '../mocks/database/WKO/companies/Kartonagenindustrie.json';
import _Klavierindustrie from '../mocks/database/WKO/companies/Klavierindustrie.json';
import _Kleinhandel_mit_Schnittblumen from '../mocks/database/WKO/companies/Kleinhandel_mit_Schnittblumen.json';
import _Konfektionierung_Papier_Karton_Pappe_zu_Produkten_aller_Art from '../mocks/database/WKO/companies/Konfektionierung_PapierKartonPappe_zu_Produkten_aller_Art.json';
import _Korb_und_Möbelflechter from '../mocks/database/WKO/companies/Korb_und_Möbelflechter.json';
import _Kork_und_Korkwarenindustrie from '../mocks/database/WKO/companies/Kork_und_Korkwarenindustrie.json';
import _Landschaftsgärtner_Garten_und_Grünflächengestalter from '../mocks/database/WKO/companies/Landschaftsgärtner_Garten_und_Grünflächengestalter.json';
import _Leimholzindustrie from '../mocks/database/WKO/companies/Leimholzindustrie.json';
import _Lüftungstechnik from '../mocks/database/WKO/companies/Lüftungstechnik.json';
import _Möbelindustrie from '../mocks/database/WKO/companies/Möbelindustrie.json';
import _Packstoffveredelungs_und_Zurichteindustrie from '../mocks/database/WKO/companies/Packstoffveredelungs_und_Zurichteindustrie.json';
import _Papier_und_Kartonveredelungsindustrie from '../mocks/database/WKO/companies/Papiereinzelhandel_im_Rahmen_einer_Trafik.json';
import _Papier_Zellstoff_Holzstoff_und_Pappenindustrie from '../mocks/database/WKO/companies/Papier_und_Kartonveredelungsindustrie.json';
import _Papiereinzelhandel_im_Rahmen_einer_Trafik from '../mocks/database/WKO/companies/Papier_Zellstoff_Holzstoff_und_Pappenindustrie.json';
import _Parkettbodenleger from '../mocks/database/WKO/companies/Parkettbodenleger.json';
import _Parkettindustrie from '../mocks/database/WKO/companies/Parkettindustrie.json';
import _Rahmen_und_Leistenindustrie from '../mocks/database/WKO/companies/Rahmen_und_Leistenindustrie.json';
import _Sanitärtechniker from '../mocks/database/WKO/companies/Sanitärtechniker.json';
import _Ski_und_Sportarktikelindustrie from '../mocks/database/WKO/companies/Ski_und_Sportarktikelindustrie.json';
import _sonstige_holzverarbeitende_Industrie from '../mocks/database/WKO/companies/sonstige_holzverarbeitende_Industrie.json';
import _Sonstige_industrielle_Papierverarbeitung from '../mocks/database/WKO/companies/Sonstige_industrielle_Papierverarbeitung.json';
import _Sonstige_industrielle_Verpackungsherstellung from '../mocks/database/WKO/companies/Sonstige_industrielle_Verpackungsherstellung.json';
import _sonstige_Sanitär_Heizungs_und_Lüftungstechniker from '../mocks/database/WKO/companies/sonstige_Sanitär_Heizungs_und_Lüftungstechniker.json';
import _Sägewerksunternehmungen from '../mocks/database/WKO/companies/Sägewerksunternehmungen.json';
import _Tischler from '../mocks/database/WKO/companies/Tischler.json';
import _Verpackungsindustrie from '../mocks/database/WKO/companies/Verpackungsindustrie.json';
import _Warmwasserbereitungsanlagen from '../mocks/database/WKO/companies/Warmwasserbereitungsanlagen.json';
import _Wellpappeindustrie from '../mocks/database/WKO/companies/Wellpappeindustrie.json';
import _Wurzelschnitzer from '../mocks/database/WKO/companies/Wurzelschnitzer.json';
import _Wärmeversorgung_unter_5_km_und_unter_5_MW from '../mocks/database/WKO/companies/Wärmeversorgungsunternehmen.json';
import _Wärmeversorgungsunternehmen from '../mocks/database/WKO/companies/Wärmeversorgung_unter_5_km_und_unter_5_MW.json';
import _Zigarettenpapierkonfektion from '../mocks/database/WKO/companies/Zigarettenpapierkonfektion.json';

import _WKO_branchen_struktur from '../mocks/database/WKO/radial_tree_scheme.json';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() {
  }

  createDb() {
    let WKO_branchen_struktur = _WKO_branchen_struktur
    let Agrarunternehmer = _Agrarunternehmer
    let Bootbauer = _Bootbauer
    let Briefumschlag_und_Papierausstattungsindustrie = _Briefumschlag_und_Papierausstattungsindustrie
    let Büro_und_Organisationsmittelindustrie = _Büro_und_Organisationsmittelindustrie
    let Bürsten_und_Pinselmacher = _Bürsten_und_Pinselmacher
    let Drechsler = _Drechsler
    let Einzelhandel_mit_Papier_Schreibwaren_und_Bürobedarf = _Einzelhandel_mit_Papier_Schreibwaren_und_Bürobedarf
    let Einzelhandel_mit_Romane_Zeitschriften_und_Magazine = _Einzelhandel_mit_Romane_Zeitschriften_und_Magazine
    let Energieholzindustrie = _Energieholzindustrie
    let Faltschachtelindustrie = _Faltschachtelindustrie
    let Floristen_Blumenbinder_und_Blumeneinzelhändler = _Floristen_Blumenbinder_und_Blumeneinzelhändler
    let Forstunternehmer = _Forstunternehmer
    let Friedhofsgärtner = _Friedhofsgärtner
    let Gartenpflege_bzweingeschränkte_Gewerbeumfänge = _Gartenpflege_bzweingeschränkte_Gewerbeumfänge
    let Gas_und_Sanitärtechnik = _Gas_und_Sanitärtechnik
    let Gaseinrichtungen_in_mobilen_Fahrzeugen_und_Anlagen = _Gaseinrichtungen_in_mobilen_Fahrzeugen_und_Anlagen
    let Gastechniker = _Gastechniker
    let Gasversorgungsunternehmen = _Gasversorgungsunternehmen
    let Großhandel_mit_Papier_Schreibwaren_und_Bürobedarf = _Großhandel_mit_Papier_Schreibwaren_und_Bürobedarf
    let Großhandel_mit_Romanen_Zeitschriften_und_Magazinen = _Großhandel_mit_Romanen_Zeitschriften_und_Magazinen
    let Großhandel_mit_Spielwaren = _Großhandel_mit_Spielwaren
    let Handel_mit_festen_mineralischen_oder_biogenen_Brennstoffen = _Handel_mit_festen_mineralischen_oder_biogenen_Brennstoffen
    let Handel_mit_Heizölen_und_Flüssiggas = _Handel_mit_Heizölen_und_Flüssiggas
    let Handel_mit_Holz = _Handel_mit_Holz
    let Handel_mit_Holzfabrikaten_und_Holzhäusern = _Handel_mit_Holzfabrikaten_und_Holzhäusern
    let Handel_mit_Papier_Schreibwaren_und_Bürobedarf = _Handel_mit_Papier_Schreibwaren_und_Bürobedarf
    let Handel_mit_Post_und_Ansichtskarten = _Handel_mit_Post_und_Ansichtskarten
    let Handel_mit_sonstigen_Mineralölprodukten = _Handel_mit_sonstigen_Mineralölprodukten
    let Handel_mit_Strom = _Handel_mit_Strom
    let Heizungstechnik = _Heizungstechnik
    let Herstellung_von_Dekorations_und_Festartikeln = _Herstellung_von_Dekorations_und_Festartikeln
    let Herstellung_von_Etiketten_aller_Art = _Herstellung_von_Etiketten_aller_Art
    let Herstellung_von_Spielkarten_und_anderer_Spielwaren_aller_Art = _Herstellung_von_Spielkarten_und_anderer_Spielwaren_aller_Art
    let Hobelwarenindustrie = _Hobelwarenindustrie
    let Hobelwerke = _Hobelwerke
    let Holzbau_Meister = _Holzbau_Meister
    let Holzbaugewerbetreibender_eingeschrauf_ausführende_Tät = _Holzbaugewerbetreibender_eingeschrauf_ausführende_Tät
    let Holzbaugewerbetreibender_eingeschränkt_auf_Teilbereiche = _Holzbaugewerbetreibender_eingeschränkt_auf_Teilbereiche
    let Holzgestalter = _Holzgestalter
    let Holzhaus_und_Hallenbauindustrie = _Holzhaus_und_Hallenbauindustrie
    let Holzimprägnier_und_veredelungsindustrie = _Holzimprägnier_und_veredelungsindustrie
    let Holzschindelerzeuger = _Holzschindelerzeuger
    let Holzverpackungs_und_packmittelindustrie = _Holzverpackungs_und_packmittelindustrie
    let Holzwerkstoffindustrie = _Holzwerkstoffindustrie
    let Holzzerkleinerer = _Holzzerkleinerer
    let Industrie_flexibler_Verpackungen = _Industrie_flexibler_Verpackungen
    let Industrie_hygienischer_Papierwaren = _Industrie_hygienischer_Papierwaren
    let industrielle_Bautischlereien = _industrielle_Bautischlereien
    let Industrielle_Buchbindereien = _Industrielle_Buchbindereien
    let Kartonagenindustrie = _Kartonagenindustrie
    let Klavierindustrie = _Klavierindustrie
    let Kleinhandel_mit_Schnittblumen = _Kleinhandel_mit_Schnittblumen
    let Konfektionierung_Papier_Karton_Pappe_zu_Produkten_aller_Art = _Konfektionierung_Papier_Karton_Pappe_zu_Produkten_aller_Art
    let Korb_und_Möbelflechter = _Korb_und_Möbelflechter
    let Kork_und_Korkwarenindustrie = _Kork_und_Korkwarenindustrie
    let Landschaftsgärtner_Garten_und_Grünflächengestalter = _Landschaftsgärtner_Garten_und_Grünflächengestalter
    let Leimholzindustrie = _Leimholzindustrie
    let Lüftungstechnik = _Lüftungstechnik
    let Möbelindustrie = _Möbelindustrie
    let Packstoffveredelungs_und_Zurichteindustrie = _Packstoffveredelungs_und_Zurichteindustrie
    let Papier_und_Kartonveredelungsindustrie = _Papier_und_Kartonveredelungsindustrie
    let Papier_Zellstoff_Holzstoff_und_Pappenindustrie = _Papier_Zellstoff_Holzstoff_und_Pappenindustrie
    let Papiereinzelhandel_im_Rahmen_einer_Trafik = _Papiereinzelhandel_im_Rahmen_einer_Trafik
    let Parkettbodenleger = _Parkettbodenleger
    let Parkettindustrie = _Parkettindustrie
    let Rahmen_und_Leistenindustrie = _Rahmen_und_Leistenindustrie
    let Sanitärtechniker = _Sanitärtechniker
    let Ski_und_Sportarktikelindustrie = _Ski_und_Sportarktikelindustrie
    let sonstige_holzverarbeitende_Industrie = _sonstige_holzverarbeitende_Industrie
    let Sonstige_industrielle_Papierverarbeitung = _Sonstige_industrielle_Papierverarbeitung
    let Sonstige_industrielle_Verpackungsherstellung = _Sonstige_industrielle_Verpackungsherstellung
    let sonstige_Sanitär_Heizungs_und_Lüftungstechniker = _sonstige_Sanitär_Heizungs_und_Lüftungstechniker
    let Sägewerksunternehmungen = _Sägewerksunternehmungen
    let Tischler = _Tischler
    let Verpackungsindustrie = _Verpackungsindustrie
    let Warmwasserbereitungsanlagen = _Warmwasserbereitungsanlagen
    let Wellpappeindustrie = _Wellpappeindustrie
    let Wurzelschnitzer = _Wurzelschnitzer
    let Wärmeversorgung_unter_5_km_und_unter_5_MW = _Wärmeversorgung_unter_5_km_und_unter_5_MW
    let Wärmeversorgungsunternehmen = _Wärmeversorgungsunternehmen
    let Zigarettenpapierkonfektion = _Zigarettenpapierkonfektion


    return {
      WKO_branchen_struktur,
      Agrarunternehmer,
      Bootbauer,
      Briefumschlag_und_Papierausstattungsindustrie,
      Büro_und_Organisationsmittelindustrie,
      Bürsten_und_Pinselmacher,
      Drechsler,
      Einzelhandel_mit_Papier_Schreibwaren_und_Bürobedarf,
      Einzelhandel_mit_Romane_Zeitschriften_und_Magazine,
      Energieholzindustrie,
      Faltschachtelindustrie,
      Floristen_Blumenbinder_und_Blumeneinzelhändler,
      Forstunternehmer,
      Friedhofsgärtner,
      Gartenpflege_bzweingeschränkte_Gewerbeumfänge,
      Gas_und_Sanitärtechnik,
      Gaseinrichtungen_in_mobilen_Fahrzeugen_und_Anlagen,
      Gastechniker,
      Gasversorgungsunternehmen,
      Großhandel_mit_Papier_Schreibwaren_und_Bürobedarf,
      Großhandel_mit_Romanen_Zeitschriften_und_Magazinen,
      Großhandel_mit_Spielwaren,
      Handel_mit_festen_mineralischen_oder_biogenen_Brennstoffen,
      Handel_mit_Heizölen_und_Flüssiggas,
      Handel_mit_Holz,
      Handel_mit_Holzfabrikaten_und_Holzhäusern,
      Handel_mit_Papier_Schreibwaren_und_Bürobedarf,
      Handel_mit_Post_und_Ansichtskarten,
      Handel_mit_sonstigen_Mineralölprodukten,
      Handel_mit_Strom,
      Heizungstechnik,
      Herstellung_von_Dekorations_und_Festartikeln,
      Herstellung_von_Etiketten_aller_Art,
      Herstellung_von_Spielkarten_und_anderer_Spielwaren_aller_Art,
      Hobelwarenindustrie,
      Hobelwerke,
      Holzbau_Meister,
      Holzbaugewerbetreibender_eingeschrauf_ausführende_Tät,
      Holzbaugewerbetreibender_eingeschränkt_auf_Teilbereiche,
      Holzgestalter,
      Holzhaus_und_Hallenbauindustrie,
      Holzimprägnier_und_veredelungsindustrie,
      Holzschindelerzeuger,
      Holzverpackungs_und_packmittelindustrie,
      Holzwerkstoffindustrie,
      Holzzerkleinerer,
      Industrie_flexibler_Verpackungen,
      Industrie_hygienischer_Papierwaren,
      industrielle_Bautischlereien,
      Industrielle_Buchbindereien,
      Kartonagenindustrie,
      Klavierindustrie,
      Kleinhandel_mit_Schnittblumen,
      Konfektionierung_Papier_Karton_Pappe_zu_Produkten_aller_Art,
      Korb_und_Möbelflechter,
      Kork_und_Korkwarenindustrie,
      Landschaftsgärtner_Garten_und_Grünflächengestalter,
      Leimholzindustrie,
      Lüftungstechnik,
      Möbelindustrie,
      Packstoffveredelungs_und_Zurichteindustrie,
      Papier_und_Kartonveredelungsindustrie,
      Papier_Zellstoff_Holzstoff_und_Pappenindustrie,
      Papiereinzelhandel_im_Rahmen_einer_Trafik,
      Parkettbodenleger,
      Parkettindustrie,
      Rahmen_und_Leistenindustrie,
      Sanitärtechniker,
      Ski_und_Sportarktikelindustrie,
      sonstige_holzverarbeitende_Industrie,
      Sonstige_industrielle_Papierverarbeitung,
      Sonstige_industrielle_Verpackungsherstellung,
      sonstige_Sanitär_Heizungs_und_Lüftungstechniker,
      Sägewerksunternehmungen,
      Tischler,
      Verpackungsindustrie,
      Warmwasserbereitungsanlagen,
      Wellpappeindustrie,
      Wurzelschnitzer,
      Wärmeversorgung_unter_5_km_und_unter_5_MW,
      Wärmeversorgungsunternehmen,
      Zigarettenpapierkonfektion,
    };
  }

  // genId(): number {
  //   return .length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  // }

}
