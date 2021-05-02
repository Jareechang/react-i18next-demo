import * as React from 'react';
import {
    useTranslation
} from '@common/i18n';
import {
    AppBar,
    Toolbar,
    Typography,
    Button
} from '@material-ui/core';

import './i18n';

export interface HeaderProps {
    i18n: any;
}

const Header: React.FC<HeaderProps> = (
    props: HeaderProps
) => {
    const { t } = useTranslation(['header:translations']);
    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6">
                    My App
                </Typography>
                <Button color="inherit">{t('app.login')}</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
