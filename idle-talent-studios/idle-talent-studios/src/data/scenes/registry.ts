import amyCh1FirstMeeting from './amy/ch1_first_meeting.json'
import amyCh2FirstLesson from './amy/ch2_first_lesson.json'
import amyCh3AfterHours from './amy/ch3_after_hours.json'
import amyCh4TheAsk from './amy/ch4_the_ask.json'
import amyCh5NightOut from './amy/ch5_night_out.json'
import amyCh6Reveal from './amy/ch6_reveal.json'
import amyCh7Warning from './amy/ch7_warning.json'
import amyCh8Confrontation from './amy/ch8_confrontation.json'
import amyCh9HiddenChoice from './amy/ch9_hidden_choice.json'
import amyCh10TheShift from './amy/ch10_the_shift.json'
import amyCh11Public from './amy/ch11_public.json'
import amyCh12Ending from './amy/ch12_ending.json'
import amyEndingTrue from './amy/ending_true.json'
import amyEndingGood from './amy/ending_good.json'
import amyEndingHeartbreak from './amy/ending_heartbreak.json'

import marcusCh1OnSet from './marcus/ch1_on_set.json'
import marcusCh2TheSession from './marcus/ch2_the_session.json'
import marcusCh3PressJunket from './marcus/ch3_press_junket.json'
import marcusCh4Marissa from './marcus/ch4_marissa.json'
import marcusCh5TheLeak from './marcus/ch5_the_leak.json'
import marcusCh6Overheard from './marcus/ch6_overheard.json'
import marcusCh7TheChoice from './marcus/ch7_the_choice.json'
import marcusCh8Ending from './marcus/ch8_ending.json'
import marcusEndingGood from './marcus/ending_good.json'
import marcusEndingHeartbreak from './marcus/ending_heartbreak.json'

import olivierCh1Audition from './olivier/ch1_audition.json'
import olivierCh2Callback from './olivier/ch2_callback.json'
import olivierCh3FirstWeek from './olivier/ch3_first_week.json'
import olivierCh4Rehearsal from './olivier/ch4_rehearsal.json'
import olivierCh5AfterWrap from './olivier/ch5_after_wrap.json'
import olivierCh6ParkBench from './olivier/ch6_park_bench.json'
import olivierCh7GigOffer from './olivier/ch7_gig_offer.json'
import olivierCh8TheDistance from './olivier/ch8_the_distance.json'
import olivierCh9CannesPrep from './olivier/ch9_cannes_prep.json'
import olivierCh10Premiere from './olivier/ch10_premiere.json'
import olivierCh11Exposure from './olivier/ch11_exposure.json'
import olivierCh12Ending from './olivier/ch12_ending.json'
import olivierEndingTrue from './olivier/ending_true.json'
import olivierEndingGood from './olivier/ending_good.json'
import olivierEndingHeartbreak from './olivier/ending_heartbreak.json'

import remyCh1Introduction from './remy/ch1_introduction.json'
import remyCh2TheFitting from './remy/ch2_the_fitting.json'
import remyCh3GalaNight from './remy/ch3_gala_night.json'
import remyCh4SoapOpera from './remy/ch4_soap_opera.json'
import remyCh5FrontPage from './remy/ch5_front_page.json'
import remyCh6OffTheRecord from './remy/ch6_off_the_record.json'
import remyCh7TheShow from './remy/ch7_the_show.json'
import remyCh8Ending from './remy/ch8_ending.json'
import remyEndingGood from './remy/ending_good.json'
import remyEndingHeartbreak from './remy/ending_heartbreak.json'

import dexCh1Hired from './dex/ch1_hired.json'
import dexCh2TheShoot from './dex/ch2_the_shoot.json'
import dexCh3AfterHours from './dex/ch3_after_hours.json'
import dexCh4CheckIn from './dex/ch4_check_in.json'
import dexCh5Ending from './dex/ch5_ending.json'
import dexEndingTrue from './dex/ending_true.json'
import dexEndingGood from './dex/ending_good.json'
import dexEndingHeartbreak from './dex/ending_heartbreak.json'

import sunnyCh1Reconnection from './sunny/ch1_reconnection.json'
import sunnyCh2RehearsalRoom from './sunny/ch2_rehearsal_room.json'
import sunnyCh3RememberWhen from './sunny/ch3_remember_when.json'
import sunnyCh4FameCheck from './sunny/ch4_fame_check.json'
import sunnyCh5Ending from './sunny/ch5_ending.json'
import sunnyEndingTrue from './sunny/ending_true.json'
import sunnyEndingGood from './sunny/ending_good.json'
import sunnyEndingHeartbreak from './sunny/ending_heartbreak.json'

import celesteCh1Fitting from './celeste/ch1_fitting.json'
import celesteCh2PressDay from './celeste/ch2_press_day.json'
import celesteCh3DamageControl from './celeste/ch3_damage_control.json'
import celesteCh4Strategy from './celeste/ch4_strategy.json'
import celesteCh5OffClock from './celeste/ch5_off_clock.json'
import celesteCh6TheLeak from './celeste/ch6_the_leak.json'
import celesteCh7OffTheRecord from './celeste/ch7_off_the_record.json'
import celesteCh8Ending from './celeste/ch8_ending.json'
import celesteEndingSecret from './celeste/ending_secret.json'
import celesteEndingGood from './celeste/ending_good.json'
import celesteEndingHeartbreak from './celeste/ending_heartbreak.json'

import driverTrigger1FirstRide from './driver/trigger1_first_ride.json'
import driverTrigger2LateNight from './driver/trigger2_late_night.json'
import driverTrigger3LongWay from './driver/trigger3_long_way.json'
import driverTrigger4LastStop from './driver/trigger4_last_stop.json'
import driverEndingTrue from './driver/ending_true.json'

import amyBondScene01 from './amy/bond/scene_01.json'
import marcusBondScene01 from './marcus/bond/scene_01.json'
import olivierBondScene01 from './olivier/bond/scene_01.json'
import remyBondScene01 from './remy/bond/scene_01.json'
import dexBondScene01 from './dex/bond/scene_01.json'
import sunnyBondScene01 from './sunny/bond/scene_01.json'
import driverBondScene01 from './driver/bond/scene_01.json'
import celesteBondScene01 from './celeste/bond/scene_01.json'

export const SCENE_REGISTRY: Record<string, object> = {
  'amy/ch1_first_meeting': amyCh1FirstMeeting,
  'amy/ch2_first_lesson': amyCh2FirstLesson,
  'amy/ch3_after_hours': amyCh3AfterHours,
  'amy/ch4_the_ask': amyCh4TheAsk,
  'amy/ch5_night_out': amyCh5NightOut,
  'amy/ch6_reveal': amyCh6Reveal,
  'amy/ch7_warning': amyCh7Warning,
  'amy/ch8_confrontation': amyCh8Confrontation,
  'amy/ch9_hidden_choice': amyCh9HiddenChoice,
  'amy/ch10_the_shift': amyCh10TheShift,
  'amy/ch11_public': amyCh11Public,
  'amy/ch12_ending': amyCh12Ending,
  'amy/ending_true': amyEndingTrue,
  'amy/ending_good': amyEndingGood,
  'amy/ending_heartbreak': amyEndingHeartbreak,

  'marcus/ch1_on_set': marcusCh1OnSet,
  'marcus/ch2_the_session': marcusCh2TheSession,
  'marcus/ch3_press_junket': marcusCh3PressJunket,
  'marcus/ch4_marissa': marcusCh4Marissa,
  'marcus/ch5_the_leak': marcusCh5TheLeak,
  'marcus/ch6_overheard': marcusCh6Overheard,
  'marcus/ch7_the_choice': marcusCh7TheChoice,
  'marcus/ch8_ending': marcusCh8Ending,
  'marcus/ending_good': marcusEndingGood,
  'marcus/ending_heartbreak': marcusEndingHeartbreak,

  'olivier/ch1_audition': olivierCh1Audition,
  'olivier/ch2_callback': olivierCh2Callback,
  'olivier/ch3_first_week': olivierCh3FirstWeek,
  'olivier/ch4_rehearsal': olivierCh4Rehearsal,
  'olivier/ch5_after_wrap': olivierCh5AfterWrap,
  'olivier/ch6_park_bench': olivierCh6ParkBench,
  'olivier/ch7_gig_offer': olivierCh7GigOffer,
  'olivier/ch8_the_distance': olivierCh8TheDistance,
  'olivier/ch9_cannes_prep': olivierCh9CannesPrep,
  'olivier/ch10_premiere': olivierCh10Premiere,
  'olivier/ch11_exposure': olivierCh11Exposure,
  'olivier/ch12_ending': olivierCh12Ending,
  'olivier/ending_true': olivierEndingTrue,
  'olivier/ending_good': olivierEndingGood,
  'olivier/ending_heartbreak': olivierEndingHeartbreak,

  'remy/ch1_introduction': remyCh1Introduction,
  'remy/ch2_the_fitting': remyCh2TheFitting,
  'remy/ch3_gala_night': remyCh3GalaNight,
  'remy/ch4_soap_opera': remyCh4SoapOpera,
  'remy/ch5_front_page': remyCh5FrontPage,
  'remy/ch6_off_the_record': remyCh6OffTheRecord,
  'remy/ch7_the_show': remyCh7TheShow,
  'remy/ch8_ending': remyCh8Ending,
  'remy/ending_good': remyEndingGood,
  'remy/ending_heartbreak': remyEndingHeartbreak,

  'dex/ch1_hired': dexCh1Hired,
  'dex/ch2_the_shoot': dexCh2TheShoot,
  'dex/ch3_after_hours': dexCh3AfterHours,
  'dex/ch4_check_in': dexCh4CheckIn,
  'dex/ch5_ending': dexCh5Ending,
  'dex/ending_true': dexEndingTrue,
  'dex/ending_good': dexEndingGood,
  'dex/ending_heartbreak': dexEndingHeartbreak,

  'sunny/ch1_reconnection': sunnyCh1Reconnection,
  'sunny/ch2_rehearsal_room': sunnyCh2RehearsalRoom,
  'sunny/ch3_remember_when': sunnyCh3RememberWhen,
  'sunny/ch4_fame_check': sunnyCh4FameCheck,
  'sunny/ch5_ending': sunnyCh5Ending,
  'sunny/ending_true': sunnyEndingTrue,
  'sunny/ending_good': sunnyEndingGood,
  'sunny/ending_heartbreak': sunnyEndingHeartbreak,

  'celeste/ch1_fitting': celesteCh1Fitting,
  'celeste/ch2_press_day': celesteCh2PressDay,
  'celeste/ch3_damage_control': celesteCh3DamageControl,
  'celeste/ch4_strategy': celesteCh4Strategy,
  'celeste/ch5_off_clock': celesteCh5OffClock,
  'celeste/ch6_the_leak': celesteCh6TheLeak,
  'celeste/ch7_off_the_record': celesteCh7OffTheRecord,
  'celeste/ch8_ending': celesteCh8Ending,
  'celeste/ending_secret': celesteEndingSecret,
  'celeste/ending_good': celesteEndingGood,
  'celeste/ending_heartbreak': celesteEndingHeartbreak,

  'driver/trigger1_first_ride': driverTrigger1FirstRide,
  'driver/trigger2_late_night': driverTrigger2LateNight,
  'driver/trigger3_long_way': driverTrigger3LongWay,
  'driver/trigger4_last_stop': driverTrigger4LastStop,
  'driver/ending_true': driverEndingTrue,

  'amy/bond/scene_01': amyBondScene01,
  'marcus/bond/scene_01': marcusBondScene01,
  'olivier/bond/scene_01': olivierBondScene01,
  'remy/bond/scene_01': remyBondScene01,
  'dex/bond/scene_01': dexBondScene01,
  'sunny/bond/scene_01': sunnyBondScene01,
  'driver/bond/scene_01': driverBondScene01,
  'celeste/bond/scene_01': celesteBondScene01,
}
