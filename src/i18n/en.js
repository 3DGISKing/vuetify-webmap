import { en } from "vuetify/locale";

const messages = {
    $vuetify: {
        ...en,
        dataIterator: {
            ...en.dataIterator,
            rowsPerPageText: "Items per page:",
            pageText: "{0}-{1} of {2}"
        }
    },

    content: {
        title: "Marine"
    }
};

export default messages;
