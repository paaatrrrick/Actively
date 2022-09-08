import { StyleSheet } from "react-native";


const appStyles = StyleSheet.create({
    bigButton: {
        width: 225,
        height: 30,
        backgroundColor: "#80fbbd",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    smallButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#80fbbd",
        textAlign: 'center',
        padding: 3,
        // paddingTop: 5,
        paddingLeft: 8,
        paddingRight: 8,
        // width: 45,
        // height: 25,
        borderRadius: 5,
        marginLeft: 10
    },
    navbar: {
        width: "100%",
        height: 40,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 10,
    },
    genericShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    input: {
        width: 225,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#262626",
        borderStyle: "solid",
        borderRadius: 5,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    box: {
        backgroundColor: "#61dafb",
        width: 80,
        height: 80,
        borderRadius: 4,
    },
});

export default appStyles;