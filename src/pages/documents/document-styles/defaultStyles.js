import { StyleSheet } from "@react-pdf/renderer";

const dStyles = StyleSheet.create({
    page: {
        flexDirection: 'col',
        backgroundColor: '#FFFFFF',
        fontFamily: "Helvetica"
    },
    header: {
        textAlign: 'center',
        marginTop: '35',
        marginBottom: '30',
    },
    h1: {
        fontSize: '26'
    },
    h2: {
        fontSize: '18'
    },
    h3: {
        fontSize: '16'
    },
    p: {
        fontSize: '14'
    },
    table: {
        display: 'table',
        width: "auto",  
        paddingBottom: 20
    },
    body: {
        paddingHorizontal: 20
    }
})

export { dStyles }