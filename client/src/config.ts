import { AxiosRequestConfig } from "axios";
import { Region } from "./services/summoners";

const config = {
    apiBase: 'http://localhost:8080',
    mocksApiBase: 'http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US',
    regions: [
        { value: 'ru', label: 'Україна', shortLabel: 'ua' },
        { value: 'br1', label: 'Бразилія', shortLabel: 'br' },
        { value: 'eun1', label: 'Північна та Східна Європа', shortLabel: 'eun' },
        { value: 'euw1', label: 'Західна Європа', shortLabel: 'euw' },
        { value: 'jp1', label: 'Японія', shortLabel: 'jp' },
        { value: 'kr', label: 'Корея', shortLabel: 'kr' },
        { value: 'la1', label: 'Північна Латинська Америка', shortLabel: 'lan' },
        { value: 'la2', label: 'Південна Латинська Америка', shortLabel: 'las' },
        { value: 'na1', label: 'Північна Америка', shortLabel: 'na' },
        { value: 'oc1', label: 'Океанія', shortLabel: 'oc' },
        { value: 'tr1', label: 'Туреччина', shortLabel: 'tr' }
    ] as { value: Region, label: string, shortLabel: string }[],
    axiosDefaults: {
        validateStatus: (status) => true,
    } as AxiosRequestConfig
}

export default config;
