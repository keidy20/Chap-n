import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import { router } from 'expo-router';

const BookDetails = ({ route, navigation }: any) => {
    const { book } = useLocalSearchParams();
    const parsedBook = typeof book === 'string' ? JSON.parse(book) : null;

    // Texto completo de la lectura
    const readingSections = [
        "El viaje del autodescubrimiento es una travesía que nos permite conocer quiénes somos realmente, más allá de las expectativas sociales y las presiones externas. A lo largo de nuestra vida, pasamos por momentos que nos marcan profundamente, pero...",
        "es en la reflexión de esos eventos donde descubrimos nuestras verdaderas pasiones, valores y deseos. Emma, por ejemplo, pasó gran parte de su vida trabajando en empleos que no la llenaban hasta que, a través de la introspección, se dio cuenta de que su verdadera pasión residía en ayudar a los demás a través del activismo social. Este descubrimiento no sucedió de la noche a la mañana, sino que fue el resultado de años de autoexploración y un genuino deseo de encontrar propósito.\n\nPara comenzar nuestro propio viaje de autodescubrimiento, es útil reflexionar sobre aquellas actividades que nos han hecho sentir más vivos y realizados. El journaling, o llevar un diario personal, es una herramienta poderosa que nos permite capturar pensamientos, emociones y experiencias de manera consciente. Al escribir, podemos identificar patrones en nuestras vidas que nos revelan lo que realmente nos importa. Además, la meditación nos brinda un espacio para desconectar....",
        "del ruido externo y conectar con nuestro ser interior, permitiéndonos observar nuestros pensamientos y emociones con mayor claridad. Estas prácticas nos ayudan a avanzar en nuestro viaje hacia la autenticidad.\n\nUna vez que tenemos una mejor comprensión de quiénes somos, el siguiente paso es tomar decisiones alineadas con ese conocimiento. Crear un mapa de vida puede ser una herramienta útil para visualizar nuestro camino personal. En él, podemos trazar nuestras experiencias más significativas, nuestros valores fundamentales y las metas que queremos alcanzar. Este mapa no solo sirve como una representación tangible de nuestro viaje, sino también como una guía que nos ayuda a mantenernos enfocados en lo que realmente importa.\n\nAl final, el autodescubrimiento es un compromiso continuo con nosotros mismos. No es un proceso lineal ni tiene un destino final claro, pero cada paso que damos nos acerca más...",
        "a vivir una vida que esté en sintonía con nuestra esencia.\n\nEl autodescubrimiento también implica reconocer y aceptar tanto nuestras fortalezas como nuestras debilidades. A menudo, nos enfocamos en mejorar nuestras debilidades, pero es igual de importante celebrar nuestras cualidades positivas. Comprender en qué somos buenos y qué nos hace únicos nos da la confianza para seguir persiguiendo nuestras metas. Emma, en su viaje, aprendió a aceptar que no necesitaba ser perfecta para tener un impacto significativo en la vida de los demás. Al hacerlo, empezó a centrarse en sus habilidades de liderazgo y empatía, que la llevaron a ser una figura clave en su comunidad de activismo social.\n\nOtro aspecto crucial del autodescubrimiento es aprender a desapegarnos de las expectativas externas.  Muchas veces, nuestras decisiones están influenciadas por lo que los demás esperan de nosotros:...",
        "nuestra familia, amigos o incluso la sociedad en general. Sin embargo, al emprender este viaje, es esencial cuestionar si realmente estamos viviendo de acuerdo con nuestras propias expectativas o si simplemente estamos cumpliendo con lo que se nos ha impuesto. Emma, por ejemplo, tuvo que dejar de lado las expectativas de una carrera convencional para seguir su verdadera pasión. Fue solo entonces cuando sintió que estaba viviendo de manera auténtica.\n\nLa curiosidad es otra herramienta valiosa en el proceso de autodescubrimiento. Permitirnos explorar nuevas ideas, actividades o incluso relaciones nos abre puertas que de otro modo podrían haber permanecido cerradas. No se trata solo de mirar hacia el pasado, sino también de estar abiertos al futuro. Emma nunca imaginó que el activismo sería su pasión, pero se permitió experimentar con diferentes formas de ayudar a los demás hasta que encontró la que más la satisfacía...",
        "Ser curiosos nos mantiene en constante evolución, lo que es esencial para nuestro crecimiento personal.\n\nPor último, es fundamental entender que el autodescubrimiento no es un destino final, sino un viaje continuo. A medida que cambiamos y crecemos con el tiempo, nuestras pasiones, intereses y metas también pueden evolucionar. Lo que hoy nos motiva puede no ser lo mismo dentro de cinco años, y eso está bien. Lo importante es mantenernos en contacto con nosotros mismos a lo largo de este proceso. Al final del día, el autodescubrimiento nos proporciona las herramientas para vivir una vida más plena, auténtica y alineada con quienes realmente somos."
    ];

    const [currentSection, setCurrentSection] = useState(0);
    const [isReading, setIsReading] = useState(false); // Estado para controlar si se ha comenzado la lectura

    const handleReadNow = () => {
        setIsReading(true);
        setCurrentSection(1); // Cambiar a la segunda sección cuando se inicia la lectura
    };

    const handleContinue = () => {
        if (currentSection < readingSections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            alert("Has completado la lectura.");
            router.back(); // O navegar a otra pantalla si es necesario
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {isReading ? (
                <View style={styles.fullScreen}>
                    {currentSection === 0 && (
                        <Text style={styles.bookTitle}>{parsedBook.title}</Text>
                    )}
                    <Text style={[
                        styles.bookDescription,
                        currentSection >= 1 && styles.additionalMargin // Aplica margen en la segunda pantalla y en las siguientes
                    ]}>
                        {readingSections[currentSection]}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleContinue}>
                            <Text style={styles.buttonText}>
                                {currentSection < readingSections.length - 1 ? "Continuar" : "Finalizar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.header}>
                        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
                            <Icon name="arrow-back" size={24} color="#FAF3EF" />
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={styles.card}>
                        {parsedBook && (
                            <>
                                <Image source={parsedBook.image} style={styles.bookImage} />
                                <Text style={styles.bookTitle}>{parsedBook.title}</Text>
                                <Text style={styles.bookDescription}>
                                    {readingSections[0]} {/* Muestra la primera parte como descripción */}
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={handleReadNow}>
                                        <Text style={styles.buttonText}>Leer Ahora</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF3EF',
    },
    fullScreen: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    bookImage: {
        width: 250,
        height: 330,
        alignSelf: 'center',
        borderRadius: 12,
        marginBottom: 16,
        marginTop: -100,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: -40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingVertical: 20,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    goBackButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        padding: 10,
        zIndex: 10,
    },
    header: {
        height: 300,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 16,
        marginTop: 16,
    },
    bookDescription: {
        fontSize: 22,
        textAlign: 'left',
        color: '#555',
        marginBottom: 16,
    },
    additionalMargin: {
        marginTop: 40, // Ajusta este valor según sea necesario
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#2A6F97',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default BookDetails;
