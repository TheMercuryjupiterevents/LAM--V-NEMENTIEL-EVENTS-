import React, { useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, Pressable, TextInput,
  StyleSheet, Alert, Linking, Platform
} from "react-native";

const C = {
  green: "#9ABF32",
  gray: "#85878C",
  cobalt: "#0047AB",
  red: "#D92332",
  yellow: "#F5C400",
  orange: "#F58220",
  ink: "#202124",
  paper: "#F7F7F5",
  white: "#FFFFFF",
};
const WEBSITE = "https://themercuryjupiterevents.github.io/LAM--V-NEMENTIEL-EVENTS-/";
const SERVICES = [
  { title: "Décoration événementielle", color: C.green, desc: "Une décoration pensée autour de votre thème et de vos envies." },
  { title: "Mariages", color: C.cobalt, desc: "Un accompagnement élégant pour célébrer votre grand jour." },
  { title: "Anniversaires", color: C.red, desc: "Des moments mémorables, conçus selon votre style." },
  { title: "Dîners privés", color: C.orange, desc: "Une ambiance soignée pour recevoir vos invités." },
  { title: "Événements professionnels", color: C.gray, desc: "Une organisation structurée pour vos événements d’entreprise." },
  { title: "Autres événements", color: C.yellow, desc: "Parlons de votre idée et imaginons le projet ensemble." },
];

export default function App() {
  const [tab, setTab] = useState("Accueil");
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", type: "", date: "", lieu: "", budget: "", details: "" });
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const openWebsite = async () => {
    try { await Linking.openURL(WEBSITE); }
    catch { Alert.alert("Site web", WEBSITE); }
  };

  const submitBooking = () => {
    const missing = !form.prenom.trim() || !form.nom.trim() || !form.email.trim() || !form.type.trim();
    if (missing) {
      Alert.alert("Informations nécessaires", "Veuillez remplir au minimum le prénom, le nom, l’e-mail et le type d’événement.");
      return;
    }
    Alert.alert(
      "Demande préparée",
      "Votre demande est remplie sur cet appareil, mais elle n’est pas encore envoyée à LAM. La connexion à un système de réservation sera ajoutée avant le lancement.",
      [{ text: "Compris" }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.colorBar}>
        {[C.green, C.gray, C.cobalt, C.red, C.yellow, C.orange].map((color) => <View key={color} style={[styles.colorSegment, { backgroundColor: color }]} />)}
      </View>
      <View style={styles.header}>
        <View style={styles.logoMark}><Text style={styles.logoLetters}>LAM</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>LAM ÉVÉNEMENTIEL</Text>
          <Text style={styles.brandSub}>& EVENTS</Text>
        </View>
        <Pressable onPress={openWebsite} style={styles.webButton}><Text style={styles.webButtonText}>Site web ↗</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === "Accueil" && <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>CRÉONS DES MOMENTS INOUBLIABLES</Text>
            <Text style={styles.heroTitle}>Vos événements,{ "\n" }notre savoir-faire.</Text>
            <Text style={styles.heroText}>Décoration, organisation et accompagnement pour des célébrations à votre image.</Text>
            <Pressable style={styles.primaryButton} onPress={() => setTab("Réservation")}><Text style={styles.primaryButtonText}>Demander un devis  →</Text></Pressable>
            <View style={styles.heroAccent}><View style={[styles.accentDot, { backgroundColor: C.green }]} /><View style={[styles.accentDot, { backgroundColor: C.cobalt }]} /><View style={[styles.accentDot, { backgroundColor: C.orange }]} /><View style={[styles.accentDot, { backgroundColor: C.red }]} /></View>
          </View>
          <SectionTitle title="Nos services" subtitle="Des idées bien pensées, des événements bien organisés." />
          {SERVICES.slice(0, 4).map((service) => <ServiceCard key={service.title} service={service} onPress={() => setTab("Services")} />)}
          <Pressable style={styles.outlineButton} onPress={() => setTab("Services")}><Text style={styles.outlineButtonText}>Découvrir tous les services</Text></Pressable>
          <View style={styles.noteCard}><Text style={styles.noteTitle}>Un projet en tête ?</Text><Text style={styles.noteText}>Dites-nous ce que vous imaginez. Notre équipe pourra étudier votre demande.</Text><Pressable onPress={() => setTab("Réservation")}><Text style={styles.linkText}>Commencer une demande →</Text></Pressable></View>
        </>}

        {tab === "Services" && <>
          <SectionTitle title="Nos services" subtitle="Choisissez un type d’événement pour commencer votre demande." />
          {SERVICES.map((service) => <ServiceCard key={service.title} service={service} onPress={() => { update("type", service.title); setTab("Réservation"); }} />)}
        </>}

        {tab === "Réservation" && <>
          <SectionTitle title="Demande de devis" subtitle="Partagez les premières informations de votre événement. Les champs marqués * sont obligatoires." />
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Prénom *</Text><TextInput value={form.prenom} onChangeText={(v) => update("prenom", v)} placeholder="Votre prénom" style={styles.input} />
            <Text style={styles.fieldLabel}>Nom *</Text><TextInput value={form.nom} onChangeText={(v) => update("nom", v)} placeholder="Votre nom" style={styles.input} />
            <Text style={styles.fieldLabel}>Adresse e-mail *</Text><TextInput value={form.email} onChangeText={(v) => update("email", v)} placeholder="nom@exemple.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <Text style={styles.fieldLabel}>Téléphone</Text><TextInput value={form.telephone} onChangeText={(v) => update("telephone", v)} placeholder="Votre numéro" keyboardType="phone-pad" style={styles.input} />
            <Text style={styles.fieldLabel}>Type d’événement *</Text><TextInput value={form.type} onChangeText={(v) => update("type", v)} placeholder="Mariage, anniversaire, dîner..." style={styles.input} />
            <Text style={styles.fieldLabel}>Date souhaitée</Text><TextInput value={form.date} onChangeText={(v) => update("date", v)} placeholder="JJ/MM/AAAA" style={styles.input} />
            <Text style={styles.fieldLabel}>Lieu de l’événement</Text><TextInput value={form.lieu} onChangeText={(v) => update("lieu", v)} placeholder="Ville ou adresse" style={styles.input} />
            <Text style={styles.fieldLabel}>Budget estimé</Text><TextInput value={form.budget} onChangeText={(v) => update("budget", v)} placeholder="Montant et devise" style={styles.input} />
            <Text style={styles.fieldLabel}>Décrivez votre projet</Text><TextInput value={form.details} onChangeText={(v) => update("details", v)} placeholder="Thème, couleurs, nombre d’invités, services..." multiline style={[styles.input, styles.multiline]} />
            <View style={styles.depositNotice}><Text style={styles.depositTitle}>Conditions de paiement</Text><Text style={styles.depositText}>Le dépôt de 70 % sera présenté selon les conditions du devis et du contrat validés par LAM. Aucun paiement n’est collecté dans cette première version.</Text></View>
            <Pressable style={styles.primaryButton} onPress={submitBooking}><Text style={styles.primaryButtonText}>Vérifier ma demande →</Text></Pressable>
          </View>
        </>}

        {tab === "Contact" && <>
          <SectionTitle title="Contactez LAM" subtitle="Parlons de votre prochain événement." />
          <View style={styles.noteCard}><Text style={styles.noteTitle}>LAM ÉVÉNEMENTIEL & EVENTS</Text><Text style={styles.noteText}>Consultez le site officiel pour retrouver les informations de contact et les détails de nos services.</Text><Pressable onPress={openWebsite} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Ouvrir le site officiel ↗</Text></Pressable></View>
          <Text style={styles.smallPrint}>La connexion aux messages, aux réservations et aux paiements sera configurée avant la publication officielle.</Text>
        </>}
      </ScrollView>

      <View style={styles.tabBar}>
        {[["Accueil", "⌂"], ["Services", "✦"], ["Réservation", "▤"], ["Contact", "○"]].map(([name, glyph]) => {
          const active = tab === name;
          return <Pressable key={name} onPress={() => setTab(name)} style={styles.tabItem}><Text style={[styles.tabGlyph, { color: active ? C.cobalt : C.gray }]}>{glyph}</Text><Text style={[styles.tabLabel, { color: active ? C.cobalt : C.gray, fontWeight: active ? "700" : "500" }]}>{name}</Text>{active && <View style={styles.tabIndicator} />}</Pressable>;
        })}
      </View>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View>;
}
function ServiceCard({ service, onPress }) {
  return <Pressable onPress={onPress} style={styles.serviceCard}><View style={[styles.serviceStripe, { backgroundColor: service.color }]} /><View style={styles.serviceCopy}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.serviceDesc}>{service.desc}</Text></View><Text style={styles.chevron}>›</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper, paddingTop: Platform.OS === "android" ? 0 : 0 },
  colorBar: { height: 5, flexDirection: "row" },
  colorSegment: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: "#ECEDE9", gap: 10 },
  logoMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.ink, alignItems: "center", justifyContent: "center", borderBottomWidth: 4, borderBottomColor: C.green },
  logoLetters: { color: C.white, fontSize: 17, fontWeight: "900", letterSpacing: 1 },
  brand: { fontSize: 13, fontWeight: "900", letterSpacing: 0.7, color: C.ink },
  brandSub: { marginTop: 2, fontSize: 11, fontWeight: "700", color: C.cobalt, letterSpacing: 2.4 },
  webButton: { paddingVertical: 9, paddingHorizontal: 11, borderRadius: 9, backgroundColor: "#EEF2E2" },
  webButtonText: { color: C.ink, fontSize: 11, fontWeight: "700" },
  content: { padding: 18, paddingBottom: 26 },
  hero: { backgroundColor: C.ink, borderRadius: 24, padding: 23, overflow: "hidden", marginBottom: 28 },
  eyebrow: { color: C.green, fontSize: 10, fontWeight: "800", letterSpacing: 1.2, marginBottom: 14 },
  heroTitle: { color: C.white, fontSize: 32, fontWeight: "900", lineHeight: 37, letterSpacing: -0.7 },
  heroText: { color: "#E2E4DF", fontSize: 14, lineHeight: 21, marginTop: 14, marginBottom: 20 },
  primaryButton: { backgroundColor: C.cobalt, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 17, alignItems: "center", marginTop: 6 },
  primaryButtonText: { color: C.white, fontSize: 14, fontWeight: "800" },
  heroAccent: { flexDirection: "row", gap: 6, marginTop: 23 },
  accentDot: { height: 5, width: 28, borderRadius: 3 },
  sectionTitle: { marginBottom: 16, marginTop: 4 },
  sectionHeading: { fontSize: 25, fontWeight: "900", color: C.ink, letterSpacing: -0.4 },
  sectionSubtitle: { color: "#656862", fontSize: 13, lineHeight: 19, marginTop: 6 },
  serviceCard: { backgroundColor: C.white, borderRadius: 15, flexDirection: "row", alignItems: "center", marginBottom: 11, overflow: "hidden", borderWidth: 1, borderColor: "#E9EAE5", minHeight: 94 },
  serviceStripe: { width: 6, alignSelf: "stretch" },
  serviceCopy: { flex: 1, paddingHorizontal: 14, paddingVertical: 14 },
  serviceTitle: { fontSize: 14, color: C.ink, fontWeight: "800" },
  serviceDesc: { color: "#686B65", fontSize: 12, lineHeight: 17, marginTop: 5 },
  chevron: { fontSize: 26, color: C.gray, paddingHorizontal: 14 },
  outlineButton: { borderColor: C.cobalt, borderWidth: 1.3, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 2 },
  outlineButtonText: { color: C.cobalt, fontWeight: "800", fontSize: 13 },
  noteCard: { backgroundColor: "#EDF2E1", padding: 19, borderRadius: 17, marginTop: 20 },
  noteTitle: { fontSize: 17, fontWeight: "900", color: C.ink },
  noteText: { color: "#51564B", fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 12 },
  linkText: { color: C.cobalt, fontWeight: "800", fontSize: 13 },
  formCard: { backgroundColor: C.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#E9EAE5" },
  fieldLabel: { fontSize: 12, fontWeight: "800", color: C.ink, marginBottom: 7, marginTop: 12 },
  input: { backgroundColor: "#FAFAF8", borderWidth: 1, borderColor: "#E1E3DC", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: C.ink },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  depositNotice: { backgroundColor: "#FFF6DB", borderLeftWidth: 4, borderLeftColor: C.yellow, padding: 12, borderRadius: 8, marginTop: 18, marginBottom: 12 },
  depositTitle: { fontSize: 13, fontWeight: "900", color: C.ink },
  depositText: { fontSize: 12, color: "#5C5540", lineHeight: 18, marginTop: 5 },
  smallPrint: { color: "#666A63", fontSize: 12, lineHeight: 18, marginTop: 16 },
  tabBar: { flexDirection: "row", backgroundColor: C.white, borderTopWidth: 1, borderTopColor: "#E6E7E1", paddingTop: 8, paddingBottom: Platform.OS === "ios" ? 8 : 10 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4, gap: 2 },
  tabGlyph: { fontSize: 19, height: 22 },
  tabLabel: { fontSize: 10 },
  tabIndicator: { height: 3, width: 20, borderRadius: 2, backgroundColor: C.cobalt, marginTop: 2 },
});
