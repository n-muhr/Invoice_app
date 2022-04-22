import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome, {SolidIcons, RegularIcons} from 'react-native-fontawesome';

export default function Register({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    check_Email: false,
    show_password: true,
    show_confirm_password: true,
  });

  const emailChange = value => {
    if (value.length > 0) {
      setData({
        ...data,
        email: value,
        check_Email: true,
      });
    } else {
      setData({
        ...data,
        email: value,
        check_Email: false,
      });
    }
  };

  const passwordChange = value => {
    setData({
      ...data,
      password: value,
    });
  };

  const passwordConfirmChange = value => {
    setData({
      ...data,
      confirm_password: value,
    });
  };

  const showPassword = () => {
    setData({
      ...data,
      show_password: !data.show_password,
    });
  };

  const showConfirmPassword = () => {
    setData({
      ...data,
      show_confirm_password: !data.show_confirm_password,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Registrace</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome
            icon={SolidIcons.user}
            style={{fontSize: 20, color: 'white'}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={'grey'}
            autoCapitalize="none"
            onChangeText={value => emailChange(value)}
          />
          {data.check_Email ? (
            <FontAwesome
              icon={RegularIcons.checkCircle}
              style={{fontSize: 20, color: 'green'}}
            />
          ) : null}
        </View>

        <Text style={[styles.text_footer, {marginTop: 25}]}>Heslo</Text>
        <View style={styles.action}>
          <FontAwesome
            icon={SolidIcons.lock}
            style={{fontSize: 20, color: 'white'}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Heslo"
            placeholderTextColor={'grey'}
            autoCapitalize="none"
            onChangeText={value => passwordChange(value)}
            secureTextEntry={data.show_password ? true : false}
          />
          <TouchableOpacity onPress={showPassword}>
            <FontAwesome
              icon={RegularIcons.eye}
              style={{fontSize: 20, color: 'grey'}}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.text_footer, {marginTop: 25}]}>
          Potvrdit heslo
        </Text>
        <View style={styles.action}>
          <FontAwesome
            icon={SolidIcons.lock}
            style={{fontSize: 20, color: 'white'}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Heslo"
            placeholderTextColor={'grey'}
            autoCapitalize="none"
            onChangeText={value => passwordConfirmChange(value)}
            secureTextEntry={data.show_confirm_password ? true : false}
          />
          <TouchableOpacity onPress={showConfirmPassword}>
            <FontAwesome
              icon={RegularIcons.eye}
              style={{fontSize: 20, color: 'grey'}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[
              styles.signIn,
              {
                borderColor: '#FF8C00',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#FF8C00',
                },
              ]}>
              Registrovat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.signIn,
              {
                borderColor: '#FF8C00',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#FF8C00',
                },
              ]}>
              Přihlásit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  footer: {
    flex: 4,
    backgroundColor: '#292C33',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#fff',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#fff',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
