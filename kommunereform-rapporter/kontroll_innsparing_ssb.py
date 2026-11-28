#!/usr/bin/env python3
"""Kontroll av innsparingspotensial på administrasjon (Telemarksforsking-rapporter 2014-2016) mot SSB.

Bruker SSBs åpne API (data.ssb.no):
  05065  Kommune, detaljerte regnskapstall, driftsregnskapet funksjonsfordelt (til 2016)
  06913  Folkemengde 1. januar

TFs definisjon: netto driftsutgifter på KOSTRA-funksjon 100, 110, 120, 121 og 130 (konsern).
Kjøres: python3 kontroll_innsparing_ssb.py
"""
import json
import urllib.request

API = "https://data.ssb.no/api/v0/no/table/"
FUNKSJONER = ["100", "110", "120", "121", "130"]


def post(table, query):
    body = json.dumps({"query": query, "response": {"format": "json-stat2"}}).encode()
    req = urllib.request.Request(API + table, data=body, headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=120))


def sel(code, values):
    return {"code": code, "selection": {"filter": "item", "values": values}}


def netto_adm(regioner, aar, omfang="2"):
    """Sum netto driftsutgifter til administrasjon (1000 kr). omfang 2 = kommunekonsern."""
    j = post("05065", [sel("Region", regioner), sel("Regnskapsomfang", [omfang]),
                       sel("FunksjonKostra", FUNKSJONER), sel("ArtGruppe", ["17"]), sel("Tid", [aar])])
    rg = list(j["dimension"]["Region"]["category"]["index"])
    v, n = j["value"], len(FUNKSJONER)
    return {r: sum(x or 0 for x in v[i * n:(i + 1) * n]) for i, r in enumerate(rg)}


def folketall(regioner, aar):
    j = post("06913", [sel("Region", regioner), sel("ContentsCode", ["Folkemengde"]), sel("Tid", [aar])])
    rg = list(j["dimension"]["Region"]["category"]["index"])
    return dict(zip(rg, j["value"]))


def alle_kommuner():
    j = json.load(urllib.request.urlopen(API + "05065", timeout=60))
    reg = [v for v in j["variables"] if v["code"] == "Region"][0]["values"]
    return [c for c in reg if len(c) == 4 and c.isdigit() and not c.startswith("99")]


def landsgjennomsnitt(aar, befolkningsaar):
    kom = alle_kommuner()
    u, p = netto_adm(kom, aar), folketall(kom, befolkningsaar)
    cs = [c for c in kom if c in u and p.get(c)]
    return sum(u[c] for c in cs) * 1000 / sum(p[c] for c in cs)


if __name__ == "__main__":
    print("== Landsgjennomsnitt, netto adm per innbygger (kr), alle kommuner, konsern")
    for aar, pop in [("2013", "2014"), ("2014", "2015")]:
        print(f"   regnskapsår {aar}, folketall 1.1.{pop}: {landsgjennomsnitt(aar, pop):.0f}")
    print("   Rapportene bruker 3 885 (Nesset-notatet 3 882)")

    print("\n== Heim (Snillfjord, Hitra, Frøya), 2014 – rapportens tall: 12 648 / 30 969 / 43 916 (sum 87 533)")
    k = {"Snillfjord": "1613", "Hitra": "1617", "Frøya": "1620"}
    u, p = netto_adm(list(k.values()), "2014"), folketall(list(k.values()), "2015")
    S, P = sum(u.values()), sum(p.values())
    for n, c in k.items():
        print(f"   {n:10s} SSB {u[c]:6d} tkr, {p[c]:5d} innb, {u[c]*1000/p[c]:6.0f} kr/innb")
    print(f"   sum {S} tkr, {P} innb")
    for lab, b in [("rapportens benchmark 3 885", 3.885), ("benchmark for regnskapsåret 2014 (4 003)", 4.003)]:
        print(f"   gevinst mot landsgjennomsnitt med {lab}: {S - P*b:,.0f} tkr (rapporten: 47 965)")

    print("\n== Voss (Voss, Vik, Aurland), 2014 – rapportens tall: sum 113 330, gevinst mot landsgj. 40 435")
    k = {"Voss": "1235", "Vik": "1417", "Aurland": "1421"}
    u, p = netto_adm(list(k.values()), "2014"), folketall(list(k.values()), "2015")
    S, P = sum(u.values()), sum(p.values())
    print(f"   SSB sum {S} tkr, {P} innb")
    for lab, b in [("3 885", 3.885), ("4 003", 4.003)]:
        print(f"   gevinst mot landsgjennomsnitt med {lab}: {S - P*b:,.0f} tkr")
