import React from 'react'
import {
    Box,
    Typography
} from '@material-ui/core'
import { useTranslation } from '@common/i18n';

interface NewsProps {}

const News : React.FC<NewsProps> = () => {
    const { t } = useTranslation(['news']);
    return (
        <div>
            <Typography variant="h4" color="textPrimary">
                {t('page.news.title')}
            </Typography>
            <Box my={2}>
                <Typography variant="body1" color="textPrimary">
                    {t('page.news.description')}
                </Typography>
            </Box>
        </div>
    );
};

export default News;
