from dataclasses import dataclass, asdict


@dataclass
class Personne:
    nom: str
    prenom: str

    def __dir__(self):(self):
        return asdict(self)


@dataclass
class Etudiant:
    personne: Personne
    cours: str


print(dict(Personne("noan", "cloarec")))
