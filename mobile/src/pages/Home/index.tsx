import React, {useEffect, useState, ChangeEvent} from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import api from '../../services/api';

interface IBGEUFsResponse {
  sigla: string,
}

interface List {
  label: string,
  value: string,
}[]

interface IBGECitiesResponse {
  nome: string,
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<List[]>([])
    const [selectedUf, setSelectedUf] = useState('0');

    const [cities, setCities] = useState<List[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
      api.get<IBGEUFsResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const filteredUfs = response.data.map(uf => ({
          label: uf.sigla,
          value: uf.sigla
        }));

        setUfs(filteredUfs);

      })
    }, [])

    useEffect(() => {
      if(selectedUf === '0') return;

      api.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const filteredCities = response.data.map(city => ({
          label: city.nome,
          value: city.nome,
        }))

        setCities(filteredCities);
      })
    }, [selectedUf])

    function handleNavigateToPoints() {
        navigation.navigate('Points', {uf: selectedUf, city: selectedCity });
    }

    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{width: 274, height: 368}}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View>
                <PickerSelect
                    placeholder={{
                      label: 'Selecione uma UF...',
                      value: '0',
                      key: '0',
                    }}
                    onValueChange={(value) => setSelectedUf(value)}
                    items={ufs}
                    style={pickerSelect}
                />

                <PickerSelect
                    placeholder={{
                      label: 'Selecione uma cidade...',
                      value: '0',
                      key: '0',
                    }}
                    onValueChange={(value) => setSelectedCity(value)}
                    items={cities}
                    style={pickerSelect}
                />
            </View>

            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                <View style={styles.buttonIcon}>
                  <Text>
                    <Icon name="arrow-right" color="#fff" size={24} />
                  </Text>
              </View>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>
            </RectButton>

        </ImageBackground>
    )
}

export default Home;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

const pickerSelect = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputAndroid: {  
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

})