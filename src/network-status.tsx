import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {ptBR} from 'date-fns/locale';
import {format} from 'date-fns';

interface ISetState {
  state: NetInfoState;
  type: 'A' | 'M';
}
export default function NetworkStatus() {
  const [netWork, setNetwork] = useState<NetInfoState>({} as NetInfoState);
  const [netWorkOk, setNetWorkOk] = useState<boolean | null>(false);
  const [log, setLog] = useState('');
  const refScroll = useRef<ScrollView>(null);
  const backgroundStyle = {
    backgroundColor: 'white',
    paddingBottom: 80,
    flex: 1,
  };
  async function updateState({state, type}: ISetState) {
    setNetWorkOk(state.isConnected);
    setNetwork(state);
    setLog(
      oldStatus =>
        `${oldStatus}\n${type} =>  ${
          state.isConnected ? 'CONECTADO' : 'SEM CONEXÃO'
        } -> ${format(new Date(), 'dd/LL/ H:mm:SSSS', {locale: ptBR})}`,
    );
  }
  const unsubscribe = NetInfo.addEventListener(async state => {
    if (state.isConnected !== netWorkOk) {
      const type = 'A';
      await updateState({state, type});
    }
  });

  async function getStatusNetwork() {
    const state = await NetInfo.fetch();
    const type = 'M';
    await updateState({state, type});
  }
  useEffect(() => {
    unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={netWorkOk ? styles.title : styles.titleError}>
        {netWorkOk ? 'CONECTADO' : 'SEM CONEXÃO'}
      </Text>
      <View style={styles.containerButtons}>
        <TouchableOpacity style={styles.button} onPress={getStatusNetwork}>
          <Text style={styles.desciption}>ATUALIZAR NETWORK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => refScroll.current?.scrollToEnd({animated: true})}>
          <Text style={styles.desciption}>¨</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.desciption}>Tipo : {netWork.type}</Text>
        <Text style={styles.desciption}>
          isConnectionExpensive :{' '}
          {netWork.details?.isConnectionExpensive ? 'VERDADEIRO' : 'FALSO'}
        </Text>
        <Text style={styles.desciption}>
          isInternetReachable :{' '}
          {netWork.isInternetReachable ? 'VERDADEIRO' : 'FALSO'}
        </Text>
        <Text style={styles.desciption}>
          IP : {netWork.details?.ipAddress || '-'}
        </Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
          ref={refScroll}>
          <Text style={styles.desciption}>Log: {`\n${log}`}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 28,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 100,
    color: 'black',
  },
  titleError: {
    fontSize: 24,
    fontWeight: '600',
    color: 'red',
  },
  desciption: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  containerButtons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
