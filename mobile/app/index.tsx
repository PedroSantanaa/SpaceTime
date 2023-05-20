import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import {
  useFonts,
  Roboto_400Regular as Roboto400,
  Roboto_700Bold as Roboto700,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold as BaiJamjuree700 } from '@expo-google-fonts/bai-jamjuree'
import blurBg from '../src/assets/bg-blue.png'
import Stripes from '../src/assets/stripes.svg'
import NLWLogo from '../src/assets/nlwMobileLogo.svg'
import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router'

const StylesStripes = styled(Stripes)

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/<93782f4c7cc6e817a57a>',
}

export default function App() {
  const router = useRouter()
  const [hasLoadedFonts] = useFonts({
    Roboto400,
    Roboto700,
    BaiJamjuree700,
  })
  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: '93782f4c7cc6e817a57a',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacestime',
      }),
    },
    discovery,
  )
  async function HandlerOAuthGithub(code: string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)
    router.push('/memories')
  }
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      HandlerOAuthGithub(code)
    }
  }, [response])
  if (!hasLoadedFonts) {
    return null
  }
  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 items-center bg-gray-900  px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StylesStripes className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2 ">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => promptAsync()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            {' '}
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" />
    </ImageBackground>
  )
}
