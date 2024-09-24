import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import { router } from 'expo-router';
import { existToken, getToken } from "@/utils/TokenUtils";

const BookDetails = () => {
    const { titulo, sections, imageUri} = useLocalSearchParams();
    const parsedBook = typeof titulo === 'string' ? JSON.parse(titulo) : null;
    console.log("CHACHIN", parsedBook)

    const readingSections = Array.isArray(sections) ? sections : JSON.parse(sections || '[]');
    const validImageUri = typeof imageUri === 'string' ? imageUri : null;
    console.log("CHACHOOOO", validImageUri)


    const [currentSection, setCurrentSection] = useState(0);
    const [isReading, setIsReading] = useState(false);

    const handleReadNow = () => {
        setIsReading(true);
        setCurrentSection(1); // Comenzar desde la segunda sección
    };

    const handleContinue = () => {
        if (currentSection < readingSections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            alert("Has completado la lectura.");
            router.back();
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {isReading ? (
                <View style={styles.fullScreen}>
                    {/* Mostrar la imagen solo en la primera sección de lectura */}
                    {currentSection === 0 && validImageUri && (
                        <Image 
                            source={{ uri: validImageUri }} 
                            style={styles.bookImage} 
                            onError={(error) => console.log('Error loading image:', error.nativeEvent.error)} 
                        />
                    )}
                    <Text style={[styles.bookDescription, currentSection >= 1 && styles.additionalMargin]}>
                        {readingSections[currentSection]?.text || ''}
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
                        {validImageUri && (
                            <>
                                <Image 
                                    source={{ uri: validImageUri }} 
                                    style={styles.bookImage} 
                                    onError={(error) => console.log('Error loading image:', error.nativeEvent.error)} 
                                />
                                <Text style={styles.bookTitle}>{parsedBook}</Text>
                                <Text style={styles.bookDescription}>
                                    {readingSections[0]?.text || ''} {/* Mostrar la primera parte como descripción */}
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
        marginTop: 40,
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
