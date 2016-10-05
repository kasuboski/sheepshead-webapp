import {AIUtil} from '../../app/scripts/AIUtil.js';
import {SheepsheadCard} from '../../app/scripts/SheepsheadCard.js';
(function () {
  'use strict';

  describe('AIUtil has functions used for the AI to make choices', function () {
    it('should choose the winning card correctly when fail led, but trump played later', function () {
      const sevenOfClubs = new SheepsheadCard(7, 0, 1, 0, '');
      const sevenOfSpades = new SheepsheadCard(7, 1, 1, 0, '');
      const sevenOfDiamonds = new SheepsheadCard(7, 3, 7, 0, '');

      const trick = [sevenOfClubs, sevenOfSpades, sevenOfDiamonds];

      const result = AIUtil.getWinningCard(trick);

      assert.equal(result, sevenOfDiamonds, 'Expected the trump to win');
    });
  });
})();
