import { StyleSheet } from "@react-pdf/renderer";

const dStyles = StyleSheet.create({
    page: {
        flexDirection: 'col',
        backgroundColor: '#FFFFFF',
        fontFamily: "Helvetica"
    },
    header: {
        textAlign: 'center',
        marginTop: '40',
        marginBottom: '40',
    },
    h1: {
        fontSize: '26'
    },
    h2: {
        fontSize: '18'
    },
    p: {
        fontSize: '14'
    },
    table: {
        display: 'table',
        width: "auto",  
    },
    body: {
        paddingHorizontal: 20
    }
})

export { dStyles }