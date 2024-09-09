import React from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import CaretWrapper from '@components/CaretWrapper';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import {PressableWithFeedback} from '@components/Pressable';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import usePolicy from '@hooks/usePolicy';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useThemeStyles from '@hooks/useThemeStyles';
import * as CardUtils from '@libs/CardUtils';
import Navigation from '@navigation/Navigation';
import variables from '@styles/variables';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

type WorkspaceCompanyCardsListHeaderButtonsProps = {
    /** Current policy id */
    policyID: string;

    /** Currently selected feed */
    selectedFeed: string;

    /** Is pending state of the feed */
    isPending: boolean;
};

function WorkspaceCompanyCardsListHeaderButtons({policyID, selectedFeed, isPending}: WorkspaceCompanyCardsListHeaderButtonsProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    const policy = usePolicy(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? -1;
    const [cardFeeds] = useOnyx(`${ONYXKEYS.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID.toString()}`);

    return (
        <View style={[styles.w100, styles.ph5, !shouldUseNarrowLayout ? [styles.pv2, styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween] : styles.pb2]}>
            <PressableWithFeedback
                onPress={() => Navigation.navigate(ROUTES.WORKSPACE_COMPANY_CARDS_SELECT_FEED.getRoute(policyID))}
                style={[styles.flexRow, styles.alignItemsCenter, styles.gap3, styles.ml4, shouldUseNarrowLayout && styles.mb3]}
                accessibilityLabel={cardFeeds?.companyCardNicknames?.[selectedFeed]}
            >
                <Icon
                    src={CardUtils.getCardFeedIcon(selectedFeed)}
                    width={variables.iconSizeExtraLarge}
                    height={variables.iconSizeExtraLarge}
                />
                <View>
                    <CaretWrapper>
                        <Text style={styles.textStrong}>{cardFeeds?.companyCardNicknames?.[selectedFeed]}</Text>
                    </CaretWrapper>
                    <Text style={styles.textLabelSupporting}>{translate('workspace.companyCards.customFeed')}</Text>
                </View>
            </PressableWithFeedback>

            <View style={[styles.flexRow, styles.gap2]}>
                <Button
                    medium
                    success
                    isDisabled={isPending}
                    // TODO: navigate to Assign card flow when it's implemented
                    onPress={() => {}}
                    icon={Expensicons.Plus}
                    text={translate('workspace.companyCards.assignCard')}
                    style={shouldUseNarrowLayout && styles.flex1}
                />
                <Button
                    medium
                    onPress={() => Navigation.navigate(ROUTES.WORKSPACE_COMPANY_CARDS_SETTINGS.getRoute(policyID))}
                    icon={Expensicons.Gear}
                    text={translate('common.settings')}
                    style={shouldUseNarrowLayout && styles.flex1}
                />
            </View>
        </View>
    );
}

WorkspaceCompanyCardsListHeaderButtons.displayName = 'WorkspaceCompanyCardsListHeaderButtons';

export default WorkspaceCompanyCardsListHeaderButtons;
