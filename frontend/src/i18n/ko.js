import { de } from "vuetify/locale";

const messages = {
    $vuetify: {
        ...de,
        dataIterator: {
            ...de.dataIterator,
            rowsPerPageText: "Elemente pro Seite:",
            pageText: "{0}-{1} von {2}"
        }
    },
    content: {
        title: "Inhalte"
    }
};

export default messages;
