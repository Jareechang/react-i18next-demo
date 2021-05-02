import React, {useState} from 'react'

import {
    Box,
    List,
    ListItem,
    Select,
    MenuItem,
    Typography
} from '@material-ui/core'
import {
    Link,
    Route,
    Switch
} from 'react-router-dom'
//import { useTranslation } from 'react-i18next'
import { useTranslation } from '@common/i18n';

import Home from './pages/Home'
import News from './pages/News'
import history from './history';

import { Header } from '@common/header';

export interface HomeProps {}

const App : React.FC<HomeProps> = () => {
    const {t, i18n} = useTranslation(['common', 'languages'])
    const [lang, setLang] = useState<string>('en')

    const handleLanguageChange = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        const newLang : string = e.target.value as string
        setLang(newLang)
        history.push({
            pathname: '/',
            search: `?lng=${newLang}`
        })
        i18n.changeLanguage(newLang)
    }

    return (
        <Box mx={4} my={12}>
            <Header i18n={i18n} />
            <Box my={2}>
                <List>
                    <ListItem>
                        <Link to="/">
                            {t('links.home')}
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/news">
                            {t('links.news')}
                        </Link>
                    </ListItem>
                </List>
            </Box>
            <Box my={2}>
                <Typography variant="h6" color="textPrimary">
                    {t('languages')}
                </Typography>
                <Select value={lang} onChange={handleLanguageChange}>
                    <MenuItem value="en">{t('languages:en')}</MenuItem>
                    <MenuItem value="es">{t('languages:es')}</MenuItem>
                </Select>
            </Box>
            <Box my={2}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/news" component={News} />
                </Switch>
            </Box>
        </Box>
    );
}

export default App;
