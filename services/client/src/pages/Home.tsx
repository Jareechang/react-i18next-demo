import React from 'react'
import {
    Box,
    Typography
} from '@material-ui/core'

import { useTranslation } from 'react-i18next';

interface HomeProps {
}

const Home : React.FC<HomeProps> = () => {
    const { t } = useTranslation(['home']);
    return (
        <div>
            <Typography variant="h4" color="textPrimary">
                {t('page.home.title')}
            </Typography>
            <Box my={2}>
                <Typography variant="body1" color="textPrimary">
                    {t('page.home.description')}
                </Typography>
            </Box>
        </div>
    );
};

export default Home;
