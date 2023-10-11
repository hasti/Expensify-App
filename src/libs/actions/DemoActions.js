import Config from 'react-native-config';
import Onyx from 'react-native-onyx';
import _ from 'underscore';
import lodashGet from 'lodash/get';
import * as API from '../API';
import * as ReportUtils from '../ReportUtils';
import Navigation from '../Navigation/Navigation';
import ROUTES from '../../ROUTES';
import ONYXKEYS from '../../ONYXKEYS';

let currentUserAccountID;
let currentUserEmail;
Onyx.connect({
    key: ONYXKEYS.SESSION,
    callback: (val) => {
        currentUserAccountID = lodashGet(val, 'accountID', 0);
        currentUserEmail = lodashGet(val, 'email', '');
    },
});

function runMoney2020Demo() {
    // Try to navigate to existing demo chat if it exists in Onyx
    const money2020AccountID = Number(Config?.EXPENSIFY_ACCOUNT_ID_MONEY2020 ?? 15864555);
    const chatReportID = ReportUtils.getChatByParticipants([money2020AccountID]);
    if (chatReportID) {
        // We must call goBack() to remove the demo route from nav history
        Navigation.goBack();
        Navigation.navigate(ROUTES.getReportRoute(chatReportID));
        return;
    }

    API.makeRequestWithSideEffects('CreateChatReport', {
        emailList: `${currentUserEmail},money2020@expensify.com`,
        activationConference: 'money2020',
    }).then((response) => {
        // If there's no response or no reportID in the response, navigate the user home so user doesn't get stuck.
        if (!response || !response.reportID) {
            Navigation.goBack();
            Navigation.navigate(ROUTES.HOME);
            return;
        }

        // Get reportID & navigate to it
        // Note: We must call goBack() to remove the demo route from history
        const chatReportID = response.reportID;
        Navigation.goBack();
        Navigation.navigate(ROUTES.REPORT_WITH_ID.getRoute(chatReportID));
    });
}

/**
 * Runs code for specific demos, based on the provided URL
 *
 * @param {String} url - URL user is navigating to via deep link (or regular link in web)
 */
function runDemoByURL(url = '') {
    const cleanUrl = (url || '').toLowerCase();

    if (cleanUrl.endsWith(ROUTES.MONEY2020)) {
        Onyx.set(ONYXKEYS.DEMO_INFO, {
            money2020: {
                isBeginningDemo: true,
            },
        });
    } else {
        // No demo is being run, so clear out demo info
        Onyx.set(ONYXKEYS.DEMO_INFO, null);
    }
}

export {runMoney2020Demo, runDemoByURL};

