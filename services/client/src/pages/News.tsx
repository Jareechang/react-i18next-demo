import React from 'react'
import {
    Box,
    Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from '@common/i18n';

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
            <Trans
                ns="common"
                i18nKey="button.go_back"
                components={[
                    <Link to="/"></Link>
                ]}
            />
        </div>
    );
};

export default News;
