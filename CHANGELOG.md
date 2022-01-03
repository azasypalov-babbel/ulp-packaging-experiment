# Changelog

## iOS release 20.89.0

- Update ruby version to 2.7.5 [#3701]
- Fix height issue for Safari 12 [#3721]
- Shorten feedback state [#3720]
- Disable interactive UI while non-clickable [#3719]
- [ARTOO-2320] matching playback + matching info text [#3698]
- Add missing Polish translation for play button on comprehension audio [#3714]
- Enable comprehension on web [#3710]
- Dependency Updates [#3696], [#3702], [#3711], [#3704]
- Inline translation fixes [#3687]
- [CAT-3766] Comprehension text trainer flow [#3625]

[#3701]: https://github.com/lessonnine/lesson-player.spa/pull/3701
[#3721]: https://github.com/lessonnine/lesson-player.spa/pull/3721
[#3720]: https://github.com/lessonnine/lesson-player.spa/pull/3720
[#3719]: https://github.com/lessonnine/lesson-player.spa/pull/3719
[#3698]: https://github.com/lessonnine/lesson-player.spa/pull/3698
[#3714]: https://github.com/lessonnine/lesson-player.spa/pull/3714
[#3711]: https://github.com/lessonnine/lesson-player.spa/pull/3711
[#3710]: https://github.com/lessonnine/lesson-player.spa/pull/3710
[#3704]: https://github.com/lessonnine/lesson-player.spa/pull/3704
[#3696]: https://github.com/lessonnine/lesson-player.spa/pull/3696
[#3687]: https://github.com/lessonnine/lesson-player.spa/pull/3687
[#3625]: https://github.com/lessonnine/lesson-player.spa/pull/3625
[#3702]: https://github.com/lessonnine/lesson-player.spa/pull/3702

## iOS release 20.88.0

- Play button's icon should not change while going to the next clip [#3699]
- Extra space below interaction/feedback/continue sheet fix [#3700]
- Audio files pile up and play simultaneously & fix rollbar logging [#3689]
- Back & forward disabled state changes & other design changes [#3686]
- Add integration tests liste to PR checklist [#3691]
- Dependency Updates [#3692], [#3693], [#3681], [#3694], [#3695]
- Add feedback to Matching trainer [#3673]
- Investigate whether Android supports resize on HintButton [#3690]

[#3699]: https://github.com/lessonnine/lesson-player.spa/pull/3699
[#3700]: https://github.com/lessonnine/lesson-player.spa/pull/3700
[#3689]: https://github.com/lessonnine/lesson-player.spa/pull/3689
[#3686]: https://github.com/lessonnine/lesson-player.spa/pull/3686
[#3691]: https://github.com/lessonnine/lesson-player.spa/pull/3691
[#3692]: https://github.com/lessonnine/lesson-player.spa/pull/3692
[#3693]: https://github.com/lessonnine/lesson-player.spa/pull/3693
[#3681]: https://github.com/lessonnine/lesson-player.spa/pull/3681
[#3694]: https://github.com/lessonnine/lesson-player.spa/pull/3694
[#3695]: https://github.com/lessonnine/lesson-player.spa/pull/3695
[#3673]: https://github.com/lessonnine/lesson-player.spa/pull/3673
[#3690]: https://github.com/lessonnine/lesson-player.spa/pull/3690

## iOS release 20.87.0

- Bugfixes: No continue button in vocab (dictate) [#3667], [#3671]
- Bugfix: Not possible to listen to own recording in Speaking Review [#3655]
- Matching Trainer: Create inline item translation [#3649]
- Add TypeScript working agreement to lesson-player README [#3651]
- Add TypeScript migration script [#3657]
- Fillin-Interaction Bugfix: Ensure spaces between words are maintained when getting correct target text [#3656]
- UATs maintenance [#3658], [#3669], [#3653], [#3670]
- Update dependencies [#3663], [#3660], [#3661], [#3662], [#3650], [#3676],
  [#3680], [#3679], [#3677], [#3685]
- Add QA build step to lesson-player README [#3675]
- Improve changelog.sh script [#3684]

[#3675]: https://github.com/lessonnine/lesson-player.spa/pull/3675
[#3684]: https://github.com/lessonnine/lesson-player.spa/pull/3684
[#3685]: https://github.com/lessonnine/lesson-player.spa/pull/3685
[#3677]: https://github.com/lessonnine/lesson-player.spa/pull/3677
[#3679]: https://github.com/lessonnine/lesson-player.spa/pull/3679
[#3680]: https://github.com/lessonnine/lesson-player.spa/pull/3680
[#3676]: https://github.com/lessonnine/lesson-player.spa/pull/3676
[#3655]: https://github.com/lessonnine/lesson-player.spa/pull/3655
[#3671]: https://github.com/lessonnine/lesson-player.spa/pull/3671
[#3670]: https://github.com/lessonnine/lesson-player.spa/pull/3670
[#3667]: https://github.com/lessonnine/lesson-player.spa/pull/3667
[#3649]: https://github.com/lessonnine/lesson-player.spa/pull/3649
[#3651]: https://github.com/lessonnine/lesson-player.spa/pull/3651
[#3657]: https://github.com/lessonnine/lesson-player.spa/pull/3657
[#3656]: https://github.com/lessonnine/lesson-player.spa/pull/3656
[#3658]: https://github.com/lessonnine/lesson-player.spa/pull/3658
[#3669]: https://github.com/lessonnine/lesson-player.spa/pull/3669
[#3653]: https://github.com/lessonnine/lesson-player.spa/pull/3653
[#3663]: https://github.com/lessonnine/lesson-player.spa/pull/3663
[#3660]: https://github.com/lessonnine/lesson-player.spa/pull/3660
[#3661]: https://github.com/lessonnine/lesson-player.spa/pull/3661
[#3662]: https://github.com/lessonnine/lesson-player.spa/pull/3662
[#3650]: https://github.com/lessonnine/lesson-player.spa/pull/3650

## iOS release 20.86.0

- In Progress: Comprehension Audio: trainer flow [#3617]
- In Progress: Matching Animation [#3552]
- Fix: Fillin cut off issue on first review item [#3627]
- Fix: Disable iOS magnifier on mic-button. [#3632]
- Add configuration for TypeScript [#3639]
- Clear up jest warnings [#3638]
- Add ADR for static types in the lesson-player [#3606]
- Add Rollbar proxy for android [#3626]
- Dependency updates [#3647], [#3645], [#3644], [#3641], [#3642], [#3648], [#3633], [#3611], [#3613], [#3620], [#3629], [#3637], [#3636], [#3634], [#3619], [#3602], [#3623], [#3622], [#3630], [#3628], [#3631]

[#3617]: https://github.com/lessonnine/lesson-player.spa/pull/3617
[#3647]: https://github.com/lessonnine/lesson-player.spa/pull/3647
[#3645]: https://github.com/lessonnine/lesson-player.spa/pull/3645
[#3644]: https://github.com/lessonnine/lesson-player.spa/pull/3644
[#3641]: https://github.com/lessonnine/lesson-player.spa/pull/3641
[#3642]: https://github.com/lessonnine/lesson-player.spa/pull/3642
[#3648]: https://github.com/lessonnine/lesson-player.spa/pull/3648
[#3639]: https://github.com/lessonnine/lesson-player.spa/pull/3639
[#3627]: https://github.com/lessonnine/lesson-player.spa/pull/3627
[#3638]: https://github.com/lessonnine/lesson-player.spa/pull/3638
[#3632]: https://github.com/lessonnine/lesson-player.spa/pull/3632
[#3624]: https://github.com/lessonnine/lesson-player.spa/pull/3624
[#3633]: https://github.com/lessonnine/lesson-player.spa/pull/3633
[#3611]: https://github.com/lessonnine/lesson-player.spa/pull/3611
[#3613]: https://github.com/lessonnine/lesson-player.spa/pull/3613
[#3620]: https://github.com/lessonnine/lesson-player.spa/pull/3620
[#3629]: https://github.com/lessonnine/lesson-player.spa/pull/3629
[#3637]: https://github.com/lessonnine/lesson-player.spa/pull/3637
[#3636]: https://github.com/lessonnine/lesson-player.spa/pull/3636
[#3634]: https://github.com/lessonnine/lesson-player.spa/pull/3634
[#3619]: https://github.com/lessonnine/lesson-player.spa/pull/3619
[#3602]: https://github.com/lessonnine/lesson-player.spa/pull/3602
[#3623]: https://github.com/lessonnine/lesson-player.spa/pull/3623
[#3622]: https://github.com/lessonnine/lesson-player.spa/pull/3622
[#3630]: https://github.com/lessonnine/lesson-player.spa/pull/3630
[#3628]: https://github.com/lessonnine/lesson-player.spa/pull/3628
[#3631]: https://github.com/lessonnine/lesson-player.spa/pull/3631
[#3552]: https://github.com/lessonnine/lesson-player.spa/pull/3552
[#3606]: https://github.com/lessonnine/lesson-player.spa/pull/3606
[#3626]: https://github.com/lessonnine/lesson-player.spa/pull/3626

## iOS release 20.85.0

- Improve matching of user input to available answers [ARTOO-2065] - [#3616]
- Fix uat: Add some waiting time - [#3618]
- Add github preview label - [#3608]
- Update dependencies - [#3605]
- Update PR template - [#3603]
- Update Swedish translation for post-purchase popup [POKE-3041] - [#3584]
- Incorrect items logged on rollbar [ARTOO-2566] - [#3577], [#3576], [#3553]
- Add information about the iOS release process [#3547]
- Fillin interaction follow up bugs [ARTOO-2564] - [#3593], [#3592], [#3590]
- Use Web Speech with maxAlternatives=5 [THREEPIO-357] - [#3594]
- Dependency updates - [#3591], [#3567], [#3566], [#3564], [#3573]

[#3616]: https://github.com/lessonnine/lesson-player.spa/pull/3616
[#3618]: https://github.com/lessonnine/lesson-player.spa/pull/3618
[#3608]: https://github.com/lessonnine/lesson-player.spa/pull/3608
[#3605]: https://github.com/lessonnine/lesson-player.spa/pull/3605
[#3603]: https://github.com/lessonnine/lesson-player.spa/pull/3603
[#3584]: https://github.com/lessonnine/lesson-player.spa/pull/3584
[#3577]: https://github.com/lessonnine/lesson-player.spa/pull/3577
[#3547]: https://github.com/lessonnine/lesson-player.spa/pull/3547
[#3593]: https://github.com/lessonnine/lesson-player.spa/pull/3593
[#3594]: https://github.com/lessonnine/lesson-player.spa/pull/3594
[#3592]: https://github.com/lessonnine/lesson-player.spa/pull/3592
[#3590]: https://github.com/lessonnine/lesson-player.spa/pull/3590
[#3576]: https://github.com/lessonnine/lesson-player.spa/pull/3576
[#3553]: https://github.com/lessonnine/lesson-player.spa/pull/3553
[#3591]: https://github.com/lessonnine/lesson-player.spa/pull/3591
[#3567]: https://github.com/lessonnine/lesson-player.spa/pull/3567
[#3566]: https://github.com/lessonnine/lesson-player.spa/pull/3566
[#3564]: https://github.com/lessonnine/lesson-player.spa/pull/3564
[#3573]: https://github.com/lessonnine/lesson-player.spa/pull/3573

## iOS release 20.84.0

No Changes for webview in iOS

## iOS release 20.83.0

- Fillin iOS bugs: [ARTOO-2215] & [ARTOO-2507] [#3561]
- Fix uat mobile workflow [#3559]

[#3561]: https://github.com/lessonnine/lesson-player.spa/pull/3561
[#3559]: https://github.com/lessonnine/lesson-player.spa/pull/3559

## iOS release 20.82.0

- Responsive dictate trainer [#3396], [#3414]
- Fix automatic scrolling for iOS [#3455]
- Make speaking-b3 feature flag non-persistent [#3529]
- Fetch rollbar access token from myjs [#3528]
- Remove invaid CSS [#3526]
- Use consistent flow for typo correction in textbox [#3415]
- Only send one abort event when closing the lesson-player during a lesson [#3508], [#3519]
- Matching Trainer: Markup is correctly shown on base and option buttons [#3489], [#3504],[#3506]
- Matching Trainer: Use activeStyle for both left and right buttons [#3490]
- Fix a failing integration test [#3501]
- Fix CI - Disable GPU [#3474]
- Update rollbar hostlist [#3468]
- Timing of elements across "new" trainers [#3395]
- Upgrade to GitHub-native Dependabot [#3333]
- Change dependabot frequency from daily to weekly [#3464]
- Update dependencies [#3426], [#3428], [#3443], [#3444], [#3481], [#3421], [#3488], [#3502], [#3505], [#3520], [#3521], [#3522], [#3527], [#3531]
- Update and cleanup Readme [#3424], [#3422]

[#3414]: https://github.com/lessonnine/lesson-player.spa/pull/3414
[#3396]: https://github.com/lessonnine/lesson-player.spa/pull/3396
[#3531]: https://github.com/lessonnine/lesson-player.spa/pull/3531
[#3527]: https://github.com/lessonnine/lesson-player.spa/pull/3527
[#3455]: https://github.com/lessonnine/lesson-player.spa/pull/3455
[#3529]: https://github.com/lessonnine/lesson-player.spa/pull/3529
[#3528]: https://github.com/lessonnine/lesson-player.spa/pull/3528
[#3526]: https://github.com/lessonnine/lesson-player.spa/pull/3526
[#3522]: https://github.com/lessonnine/lesson-player.spa/pull/3522
[#3521]: https://github.com/lessonnine/lesson-player.spa/pull/3521
[#3520]: https://github.com/lessonnine/lesson-player.spa/pull/3520
[#3519]: https://github.com/lessonnine/lesson-player.spa/pull/3519
[#3415]: https://github.com/lessonnine/lesson-player.spa/pull/3415
[#3508]: https://github.com/lessonnine/lesson-player.spa/pull/3508
[#3506]: https://github.com/lessonnine/lesson-player.spa/pull/3506
[#3505]: https://github.com/lessonnine/lesson-player.spa/pull/3505
[#3504]: https://github.com/lessonnine/lesson-player.spa/pull/3504
[#3489]: https://github.com/lessonnine/lesson-player.spa/pull/3489
[#3490]: https://github.com/lessonnine/lesson-player.spa/pull/3490
[#3502]: https://github.com/lessonnine/lesson-player.spa/pull/3502
[#3501]: https://github.com/lessonnine/lesson-player.spa/pull/3501
[#3488]: https://github.com/lessonnine/lesson-player.spa/pull/3488
[#3421]: https://github.com/lessonnine/lesson-player.spa/pull/3421
[#3481]: https://github.com/lessonnine/lesson-player.spa/pull/3481
[#3474]: https://github.com/lessonnine/lesson-player.spa/pull/3474
[#3464]: https://github.com/lessonnine/lesson-player.spa/pull/3464
[#3468]: https://github.com/lessonnine/lesson-player.spa/pull/3468
[#3444]: https://github.com/lessonnine/lesson-player.spa/pull/3444
[#3443]: https://github.com/lessonnine/lesson-player.spa/pull/3443
[#3428]: https://github.com/lessonnine/lesson-player.spa/pull/3428
[#3395]: https://github.com/lessonnine/lesson-player.spa/pull/3395
[#3333]: https://github.com/lessonnine/lesson-player.spa/pull/3333
[#3426]: https://github.com/lessonnine/lesson-player.spa/pull/3426
[#3422]: https://github.com/lessonnine/lesson-player.spa/pull/3422
[#3424]: https://github.com/lessonnine/lesson-player.spa/pull/3424

## iOS releases 20.79.0, 20.80.0, 20.81.0

No Changes for webview in iOS

## iOS release (20.78.0)

- Fix Security Alerts [#3400]
- Adjusted min-height and max-width in Matching item [#3409]
- Fixes for `MatchingItem` and `PairList` [#3408]
- Matching solved grid whitespace [#3410]
- Inverted feedback sounds in listening review [#3407]
- Add `itemUuid` and `lessonContext` to native speech message [#3401]

[#3405]: https://github.com/lessonnine/lesson-player.spa/pull/3405
[#3400]: https://github.com/lessonnine/lesson-player.spa/pull/3400
[#3409]: https://github.com/lessonnine/lesson-player.spa/pull/3409
[#3408]: https://github.com/lessonnine/lesson-player.spa/pull/3408
[#3410]: https://github.com/lessonnine/lesson-player.spa/pull/3410
[#3407]: https://github.com/lessonnine/lesson-player.spa/pull/3407
[#3401]: https://github.com/lessonnine/lesson-player.spa/pull/3401

## iOS release (20.77.0)

- Fix trainer hanging on broken sound [#3404]
- Add skip trainer feature for @babbel.com users [#3376]
- Matching trainer non-user facing changes [#3398], [#3397], [#3392]
- Github packages migration [#3399]

[#3404]: https://github.com/lessonnine/lesson-player.spa/pull/3404
[#3376]: https://github.com/lessonnine/lesson-player.spa/pull/3376
[#3398]: https://github.com/lessonnine/lesson-player.spa/pull/3398
[#3397]: https://github.com/lessonnine/lesson-player.spa/pull/3397
[#3392]: https://github.com/lessonnine/lesson-player.spa/pull/3392
[#3399]: https://github.com/lessonnine/lesson-player.spa/pull/3399
[#3394]: https://github.com/lessonnine/lesson-player.spa/pull/3394

## iOS release (20.76.0)

- Add toggle option for feedback sounds [#3382]
- Update babbel markup helper.js to 4.3.5 [#3389]
- Matching trainer non-user facing changes [#3385], [#3373]
- Disable speech recognition on Edge [#3390]
- Use publish build metadata action [#3388]
- Upgrade to npm version 7 [#3387]
- Introduce speech_recognition:attempt_evaluated event for web [#3384], [#3378]
- Support storybook preview workflow [#3381]
- Add script to generate Changelog entries [#3375]

[#3382]: https://github.com/lessonnine/lesson-player.spa/pull/3382
[#3389]: https://github.com/lessonnine/lesson-player.spa/pull/3389
[#3385]: https://github.com/lessonnine/lesson-player.spa/pull/3385
[#3390]: https://github.com/lessonnine/lesson-player.spa/pull/3390
[#3373]: https://github.com/lessonnine/lesson-player.spa/pull/3373
[#3388]: https://github.com/lessonnine/lesson-player.spa/pull/3388
[#3387]: https://github.com/lessonnine/lesson-player.spa/pull/3387
[#3384]: https://github.com/lessonnine/lesson-player.spa/pull/3384
[#3378]: https://github.com/lessonnine/lesson-player.spa/pull/3378
[#3381]: https://github.com/lessonnine/lesson-player.spa/pull/3381
[#3374]: https://github.com/lessonnine/lesson-player.spa/pull/3374
[#3375]: https://github.com/lessonnine/lesson-player.spa/pull/3375

## iOS release (20.75.0)

- Pause all sounds when moving to next slide [#3365]
- Tooltip visibility in webview [#3366]
- Add tracking for `trainer_shown: Dialog_Show` [#3372]
- Disable speech interaction on web Safari [#3369]
- Update to babbel markup helper 4.3.3 [#3371]
- Update ruby version to 2.6.7 [#3362]
- Fix message payload [#3370]
- Publish artifact metadata on deploy [#3368]
- `Tooltip` Updated design specs [#3363]
- Update ruby gems [#3361]
- Add missing import [#3367]
- Update integration tests for dialog-speak [#3360]
- Dialog Speak Feature [#3307]
- Fix security issues [#3357]

[#3365]: https://github.com/lessonnine/lesson-player.spa/pull/3365
[#3366]: https://github.com/lessonnine/lesson-player.spa/pull/3366
[#3372]: https://github.com/lessonnine/lesson-player.spa/pull/3372
[#3369]: https://github.com/lessonnine/lesson-player.spa/pull/3369
[#3371]: https://github.com/lessonnine/lesson-player.spa/pull/3371
[#3362]: https://github.com/lessonnine/lesson-player.spa/pull/3362
[#3355]: https://github.com/lessonnine/lesson-player.spa/pull/3355
[#3370]: https://github.com/lessonnine/lesson-player.spa/pull/3370
[#3368]: https://github.com/lessonnine/lesson-player.spa/pull/3368
[#3363]: https://github.com/lessonnine/lesson-player.spa/pull/3363
[#3361]: https://github.com/lessonnine/lesson-player.spa/pull/3361
[#3367]: https://github.com/lessonnine/lesson-player.spa/pull/3367
[#3360]: https://github.com/lessonnine/lesson-player.spa/pull/3360
[#3307]: https://github.com/lessonnine/lesson-player.spa/pull/3307
[#3357]: https://github.com/lessonnine/lesson-player.spa/pull/3357

## iOS release (20.74.0)

- Small fixes in our integration tests [#3337], [#3338], [#3344]
- Pass content release version to native apps [#3340]
- Track item attempt and item skip events for every user [#3341]
- Fix a bug where users were unable to type hyphens and colons in puzzlehelper interaction [#3336]
- Bump dependencies [#3345]

[#3345]: https://github.com/lessonnine/lesson-player.spa/pull/3345
[#3344]: https://github.com/lessonnine/lesson-player.spa/pull/3344
[#3336]: https://github.com/lessonnine/lesson-player.spa/pull/3336
[#3341]: https://github.com/lessonnine/lesson-player.spa/pull/3341
[#3340]: https://github.com/lessonnine/lesson-player.spa/pull/3340
[#3337]: https://github.com/lessonnine/lesson-player.spa/pull/3337
[#3338]: https://github.com/lessonnine/lesson-player.spa/pull/3338

## iOS release (20.73.0)

- Update @lessonnine/cascada.css [#3351]
- Use @lessonnine/cascada.css instead of cascada [#3350]
- Use @lessonnine/linguistic-assessment.js with speech recognition [#3299]
- Remove pageDialog from b3 [#3306]
- Update package.lock in b4 [#3309]
- Extend tooltip interface [#3301]
- Fix Gemfury private token [#3311]
- Fix a bug in the sound player [#3312]
- Add a static config file to configure interactions [#3310]
- Update intergration tests [#3318]
- Send lesson abort message in Webview [#3319]
- Native bridge Android support [#3320]
- Update to ruby version from 2.5.8 in web.test [#3324]
- Fix a bug with overlapping sounds [#3317]
- Extend Feedback Sheet Interface [#3327]

[#3299]: https://github.com/lessonnine/lesson-player.spa/pull/3299
[#3306]: https://github.com/lessonnine/lesson-player.spa/pull/3306
[#3309]: https://github.com/lessonnine/lesson-player.spa/pull/3309
[#3301]: https://github.com/lessonnine/lesson-player.spa/pull/3301
[#3311]: https://github.com/lessonnine/lesson-player.spa/pull/3311
[#3312]: https://github.com/lessonnine/lesson-player.spa/pull/3312
[#3310]: https://github.com/lessonnine/lesson-player.spa/pull/3310
[#3318]: https://github.com/lessonnine/lesson-player.spa/pull/3318
[#3319]: https://github.com/lessonnine/lesson-player.spa/pull/3319
[#3320]: https://github.com/lessonnine/lesson-player.spa/pull/3320
[#3324]: https://github.com/lessonnine/lesson-player.spa/pull/3324
[#3317]: https://github.com/lessonnine/lesson-player.spa/pull/3317
[#3327]: https://github.com/lessonnine/lesson-player.spa/pull/3327

## iOS release (20.72.0)

There were no changes in lesson-player for this release

## iOS release (20.71.0)

- Fix keyboard covering gap on iOS [#3274]
- Update dependencies (storybook to v6 + security patches) [#3305], [#3304]
- Added new dialog trainer with show interaction [#3300], [#3296], [#3295], [#3288], [#3284]
- Translation toggle positioning fix [#3285]
- Update interaction interfaces in preparation for generic speak interaction [#3290], [#3298]
- Update knapsack reports [#3292]

[#3274]: https://github.com/lessonnine/lesson-player.spa/pull/3274
[#3305]: https://github.com/lessonnine/lesson-player.spa/pull/3305
[#3304]: https://github.com/lessonnine/lesson-player.spa/pull/3304
[#3300]: https://github.com/lessonnine/lesson-player.spa/pull/3300
[#3298]: https://github.com/lessonnine/lesson-player.spa/pull/3298
[#3285]: https://github.com/lessonnine/lesson-player.spa/pull/3285
[#3296]: https://github.com/lessonnine/lesson-player.spa/pull/3296
[#3290]: https://github.com/lessonnine/lesson-player.spa/pull/3290
[#3292]: https://github.com/lessonnine/lesson-player.spa/pull/3292
[#3295]: https://github.com/lessonnine/lesson-player.spa/pull/3295
[#3288]: https://github.com/lessonnine/lesson-player.spa/pull/3288
[#3284]: https://github.com/lessonnine/lesson-player.spa/pull/3284

## iOS release (20.70.0)

- Add `SpeakItem` UI component for dialog speak [#3282]
- Fix sound playback issue when using zero-length sound files in Chrome [#3276]
- Update project setup process in `README.md` [#3277]
- Fix failing User Acceptance Test for dialog puzzlehelper [#3272]
- Fix unavailable `Promise.allSettled` used [#3275]
- Fix iOS User Acceptance Test Github Action [#3271]
- Cleanup unused demo data [#3267]
- Update `web.test` ruby dependencies [#3266]
- Implement dialog trainer and fixes [#3229], [#3273], [#3279], [#3281]

[#3282]: https://github.com/lessonnine/lesson-player.spa/pull/3282
[#3276]: https://github.com/lessonnine/lesson-player.spa/pull/3276
[#3273]: https://github.com/lessonnine/lesson-player.spa/pull/3273
[#3279]: https://github.com/lessonnine/lesson-player.spa/pull/3279
[#3281]: https://github.com/lessonnine/lesson-player.spa/pull/3281
[#3277]: https://github.com/lessonnine/lesson-player.spa/pull/3277
[#3272]: https://github.com/lessonnine/lesson-player.spa/pull/3272
[#3275]: https://github.com/lessonnine/lesson-player.spa/pull/3275
[#3271]: https://github.com/lessonnine/lesson-player.spa/pull/3271
[#3267]: https://github.com/lessonnine/lesson-player.spa/pull/3267
[#3266]: https://github.com/lessonnine/lesson-player.spa/pull/3266
[#3229]: https://github.com/lessonnine/lesson-player.spa/pull/3229

## iOS release (20.69.0)

- Revert "Use vocab speak for show interaction" [#3257]
- Fix a flaky test [#3255]
- Add failsafe to lesson-player [#3263]
- (Safari) No sound in first lesson if it is keyboard [#3265]
- Add missing comma in json file [#3261]
- RUS character substitution costs updated [#3259]

[#3265]: https://github.com/lessonnine/lesson-player.spa/pull/3265
[#3263]: https://github.com/lessonnine/lesson-player.spa/pull/3263
[#3261]: https://github.com/lessonnine/lesson-player.spa/pull/3261
[#3259]: https://github.com/lessonnine/lesson-player.spa/pull/3259
[#3255]: https://github.com/lessonnine/lesson-player.spa/pull/3255
[#3257]: https://github.com/lessonnine/lesson-player.spa/pull/3257

## iOS release (20.68.0)

- Remove mp3 from standard fileMock.js [#3245]
- Card Trainer Events for Interactions [#3241]
- Replace buzz with howler and fix sound delay [#3251]

[#3251]: https://github.com/lessonnine/lesson-player.spa/pull/3251
[#3245]: https://github.com/lessonnine/lesson-player.spa/pull/3245
[#3241]: https://github.com/lessonnine/lesson-player.spa/pull/3241

## iOS release (20.67.0)

- Refactor/use trainer item sounds [#3235]
- Move feedback sounds to Interaction [#3233]
- Add edge cases for purge to card trainer [#3230]
- Only set allowed translationVisibility values [#3231]
- Update react-pose and react-redux to latest versions [#3239]
- Fix writing review for custom lists (no image / sound) [#3228]
- Update feedback message translations [#3226]
- Improve test coverage on the translation visibility feature [#3217] [#3219]
- Cleanup unnecessary fetch of substitutions in webview [#3209]

[#3235]: https://github.com/lessonnine/lesson-player.spa/pull/3235
[#3233]: https://github.com/lessonnine/lesson-player.spa/pull/3233
[#3230]: https://github.com/lessonnine/lesson-player.spa/pull/3230
[#3231]: https://github.com/lessonnine/lesson-player.spa/pull/3231
[#3239]: https://github.com/lessonnine/lesson-player.spa/pull/3239
[#3228]: https://github.com/lessonnine/lesson-player.spa/pull/3228
[#3226]: https://github.com/lessonnine/lesson-player.spa/pull/3226
[#3219]: https://github.com/lessonnine/lesson-player.spa/pull/3219
[#3217]: https://github.com/lessonnine/lesson-player.spa/pull/3217
[#3209]: https://github.com/lessonnine/lesson-player.spa/pull/3209

## iOS release (20.66.0)

- Add keyboard trainer [#3185]
- Update node version [#3194]
- Update character substitution costs [#3200]
- Dialog trainer UI components [#3188, #3191, #3208, #3205]
- Fix render markup in vocabulary trainer translation [#3189]
- Fix translation visibility toggle broken when info text is visible [#3195]
- Fix non-latin characters as valid input for puzzle helper [#3206]
- Fix success sound on vocab wordorder [#3187]
- Fix tracking order to avoid missing `trackingUdid` property [#3183]
- Fix Rollbar/10149 [#3184]
- Track `lesson:abort` on Web [#3181]
- Improve user acceptance tests and unit tests [#3179, #3207, #3201, #3197, #3222]

[#3179]: https://github.com/lessonnine/lesson-player.spa/pull/3179
[#3207]: https://github.com/lessonnine/lesson-player.spa/pull/3207
[#3201]: https://github.com/lessonnine/lesson-player.spa/pull/3201
[#3197]: https://github.com/lessonnine/lesson-player.spa/pull/3197
[#3222]: https://github.com/lessonnine/lesson-player.spa/pull/3222
[#3181]: https://github.com/lessonnine/lesson-player.spa/pull/3181
[#3184]: https://github.com/lessonnine/lesson-player.spa/pull/3184
[#3183]: https://github.com/lessonnine/lesson-player.spa/pull/3183
[#3187]: https://github.com/lessonnine/lesson-player.spa/pull/3187
[#3206]: https://github.com/lessonnine/lesson-player.spa/pull/3206
[#3195]: https://github.com/lessonnine/lesson-player.spa/pull/3195
[#3189]: https://github.com/lessonnine/lesson-player.spa/pull/3189
[#3188]: https://github.com/lessonnine/lesson-player.spa/pull/3188
[#3191]: https://github.com/lessonnine/lesson-player.spa/pull/3191
[#3208]: https://github.com/lessonnine/lesson-player.spa/pull/3208
[#3205]: https://github.com/lessonnine/lesson-player.spa/pull/3205
[#3200]: https://github.com/lessonnine/lesson-player.spa/pull/3200
[#3194]: https://github.com/lessonnine/lesson-player.spa/pull/3194
[#3185]: https://github.com/lessonnine/lesson-player.spa/pull/3185

## iOS release (20.65.0)

- Cleanup React prop warning [#3178]
- Fix Puzzlehelper scrolling on mobile [#3171]
- Display Learning Tip for Card trainer [#3177]
- Fix event tracking payloads [#3176], [#3166], [#3172], [#3155], [#3134], [#3129]
- Update dependencies to resolve security alerts [#3165], [#3140]
- Improve UAT test coverage [#3167], [#3164], [#3174], [#3135], [#3158], [#3128], [#3149], [#3125], [#3124], [#3118]
- Prevent attempts on Card trainer while sound is playing [#3175]
- Fix Rollbar error in Refer A Friend [#3113]
- Fix sound related bugs in Card Trainer [#3170], [#3163], [#3162], [#3160]
- Fix sound related bugs in Vocabulary Trainer [#3147]
- Reduce sound playback delay on choice buttons interaction [#3133]
- UAT test <> slack integration [#3161] [#3168]
- Card Trainer b4 rebuild [#3152], [#3146], [#3132], [#3130], [#3091], [#3112]
- Fix markup rendering issue in choice buttons [#3148]
- Fix gap alignment bug in Firefox [#3106]

[#3178]: https://github.com/lessonnine/lesson-player.spa/pull/3178
[#3171]: https://github.com/lessonnine/lesson-player.spa/pull/3171
[#3177]: https://github.com/lessonnine/lesson-player.spa/pull/3177
[#3176]: https://github.com/lessonnine/lesson-player.spa/pull/3176
[#3166]: https://github.com/lessonnine/lesson-player.spa/pull/3166
[#3165]: https://github.com/lessonnine/lesson-player.spa/pull/3165
[#3167]: https://github.com/lessonnine/lesson-player.spa/pull/3167
[#3164]: https://github.com/lessonnine/lesson-player.spa/pull/3164
[#3174]: https://github.com/lessonnine/lesson-player.spa/pull/3174
[#3175]: https://github.com/lessonnine/lesson-player.spa/pull/3175
[#3172]: https://github.com/lessonnine/lesson-player.spa/pull/3172
[#3170]: https://github.com/lessonnine/lesson-player.spa/pull/3170
[#3135]: https://github.com/lessonnine/lesson-player.spa/pull/3135
[#3158]: https://github.com/lessonnine/lesson-player.spa/pull/3158
[#3161]: https://github.com/lessonnine/lesson-player.spa/pull/3161
[#3163]: https://github.com/lessonnine/lesson-player.spa/pull/3163
[#3162]: https://github.com/lessonnine/lesson-player.spa/pull/3162
[#3160]: https://github.com/lessonnine/lesson-player.spa/pull/3160
[#3156]: https://github.com/lessonnine/lesson-player.spa/pull/3156
[#3155]: https://github.com/lessonnine/lesson-player.spa/pull/3155
[#3152]: https://github.com/lessonnine/lesson-player.spa/pull/3152
[#3148]: https://github.com/lessonnine/lesson-player.spa/pull/3148
[#3128]: https://github.com/lessonnine/lesson-player.spa/pull/3128
[#3149]: https://github.com/lessonnine/lesson-player.spa/pull/3149
[#3146]: https://github.com/lessonnine/lesson-player.spa/pull/3146
[#3147]: https://github.com/lessonnine/lesson-player.spa/pull/3147
[#3133]: https://github.com/lessonnine/lesson-player.spa/pull/3133
[#3140]: https://github.com/lessonnine/lesson-player.spa/pull/3140
[#3113]: https://github.com/lessonnine/lesson-player.spa/pull/3113
[#3125]: https://github.com/lessonnine/lesson-player.spa/pull/3125
[#3134]: https://github.com/lessonnine/lesson-player.spa/pull/3134
[#3132]: https://github.com/lessonnine/lesson-player.spa/pull/3132
[#3130]: https://github.com/lessonnine/lesson-player.spa/pull/3130
[#3091]: https://github.com/lessonnine/lesson-player.spa/pull/3091
[#3124]: https://github.com/lessonnine/lesson-player.spa/pull/3124
[#3129]: https://github.com/lessonnine/lesson-player.spa/pull/3129
[#3106]: https://github.com/lessonnine/lesson-player.spa/pull/3106
[#3118]: https://github.com/lessonnine/lesson-player.spa/pull/3118
[#3112]: https://github.com/lessonnine/lesson-player.spa/pull/3112

## iOS release (20.64.0)

- ADR data normalisation proposal [#3080]
- Fix bundler gem problem [#3123]
- Set babel targets [#3122]
- Cleanup pageVocabulary [#3119]
- Fix vocabulary wordorder test [#3121]
- Add custom matchResult for wordorder [#3117]
- Close legacy speech recog after use [#3115]
- Fix invalid lesson_session:trainer:finished event [#3116][#3120]
- Revert bottom layout resize [#3085]
- Filter rollbar errors by requestUrl [#3108][#3111]
- Fix active gap stale hook [#3107]

[#3080]: https://github.com/lessonnine/lesson-player.spa/pull/3080
[#3123]: https://github.com/lessonnine/lesson-player.spa/pull/3123
[#3122]: https://github.com/lessonnine/lesson-player.spa/pull/3122
[#3119]: https://github.com/lessonnine/lesson-player.spa/pull/3119
[#3121]: https://github.com/lessonnine/lesson-player.spa/pull/3121
[#3117]: https://github.com/lessonnine/lesson-player.spa/pull/3117
[#3115]: https://github.com/lessonnine/lesson-player.spa/pull/3115
[#3120]: https://github.com/lessonnine/lesson-player.spa/pull/3120
[#3116]: https://github.com/lessonnine/lesson-player.spa/pull/3116
[#3085]: https://github.com/lessonnine/lesson-player.spa/pull/3085
[#3111]: https://github.com/lessonnine/lesson-player.spa/pull/3111
[#3108]: https://github.com/lessonnine/lesson-player.spa/pull/3108
[#3107]: https://github.com/lessonnine/lesson-player.spa/pull/3107

## iOS release (20.63.0)

- Add a HOC to wrap trainer components in to normalize trainer data to camelCase [#3102]
- Show both learn and display language texts in dictate trainers (according to translation visibility) [#3100]
- Design update for toggle buttons [#3084]
- Change the input field feedback color to yellow for cases when the user makes a typo error [#3089]
- Fix a flaky integration test [#3095]
- Design Update for webview lesson-player [#3076]
- Prevent back navigation when user hits the backspace key [#3088] [#3097]
- Simplify the interactions' implementation: pass them only a string instead of a whole item [#3078] [#3092] [#3096]
- Remove unnecessary updates of the trainer reference in the state [#3086]
- Update Release Process section of lesson-player README [#3083]
- Update Xcode version in our github actions workflows [#3082]
- Cleanup of the integration tests' code base [#3066]
- In Rollbar, do not track errors that have a request.url indicating a user's local machine [#3079]
- Remove number limit for review items in the listening trainer (was 10, is now infinite) [#3073]
- Keep single parentheses in all speaking trainers [#3077]
- Design update for the Infotext popup [#3061]
- Hide a mini scrollbar that showed up when a hardware mouse was plugged in [#3068]
- New implementation of the puzzlehelper interaction [#3069] [#3099]
- Improvement for Refer-A-Friend popup [#3071]
- Add a manual trigger to github actions for building a Babbel app with any branch of the lesson-player.spa [#3072] [#3074]
- Use local events for keyboard shortcuts in trainers with wordorder interaction [#3064]
- Add a manual trigger to github actions for running the integration tests [#3070]

[#3097]: https://github.com/lessonnine/lesson-player.spa/pull/3097
[#3102]: https://github.com/lessonnine/lesson-player.spa/pull/3102
[#3100]: https://github.com/lessonnine/lesson-player.spa/pull/3100
[#3084]: https://github.com/lessonnine/lesson-player.spa/pull/3084
[#3089]: https://github.com/lessonnine/lesson-player.spa/pull/3089
[#3099]: https://github.com/lessonnine/lesson-player.spa/pull/3099
[#3095]: https://github.com/lessonnine/lesson-player.spa/pull/3095
[#3076]: https://github.com/lessonnine/lesson-player.spa/pull/3076
[#3096]: https://github.com/lessonnine/lesson-player.spa/pull/3096
[#3092]: https://github.com/lessonnine/lesson-player.spa/pull/3092
[#3088]: https://github.com/lessonnine/lesson-player.spa/pull/3088
[#3078]: https://github.com/lessonnine/lesson-player.spa/pull/3078
[#3086]: https://github.com/lessonnine/lesson-player.spa/pull/3086
[#3083]: https://github.com/lessonnine/lesson-player.spa/pull/3083
[#3067]: https://github.com/lessonnine/lesson-player.spa/pull/3067
[#3082]: https://github.com/lessonnine/lesson-player.spa/pull/3082
[#3066]: https://github.com/lessonnine/lesson-player.spa/pull/3066
[#3079]: https://github.com/lessonnine/lesson-player.spa/pull/3079
[#3073]: https://github.com/lessonnine/lesson-player.spa/pull/3073
[#3077]: https://github.com/lessonnine/lesson-player.spa/pull/3077
[#3061]: https://github.com/lessonnine/lesson-player.spa/pull/3061
[#3068]: https://github.com/lessonnine/lesson-player.spa/pull/3068
[#3069]: https://github.com/lessonnine/lesson-player.spa/pull/3069
[#3074]: https://github.com/lessonnine/lesson-player.spa/pull/3074
[#3071]: https://github.com/lessonnine/lesson-player.spa/pull/3071
[#3072]: https://github.com/lessonnine/lesson-player.spa/pull/3072
[#3064]: https://github.com/lessonnine/lesson-player.spa/pull/3064
[#3070]: https://github.com/lessonnine/lesson-player.spa/pull/3070

## iOS release (20.62.0)

- Adjust ADRs to new repo structure [#3062]
- Create ExampleBlock component [#3060]
- Fix unexpected elements in bottomLayout causing multiple buttons bug [#3058]
- Small cleanup of demo page [#3057]
- Fix Vocabulary Tracking [#3056]
- Further Cleanup of Old Test Files [#3055]
- Monorepo structure [#3054]

[#3062] https://github.com/lessonnine/lesson-player.spa/pull/3062
[#3060] https://github.com/lessonnine/lesson-player.spa/pull/3060
[#3058] https://github.com/lessonnine/lesson-player.spa/pull/3058
[#3057] https://github.com/lessonnine/lesson-player.spa/pull/3057
[#3056] https://github.com/lessonnine/lesson-player.spa/pull/3056
[#3055] https://github.com/lessonnine/lesson-player.spa/pull/3055
[#3054] https://github.com/lessonnine/lesson-player.spa/pull/3054

## iOS release (20.61.0)

- Choicebuttons integration [#3045]
- Add new styles for Speaking Trainers interaction cards [#3039]
- Remove flaky cyrillic alphabet test [#3048]
- Change web.test folder structure [#3027]
- Bugfix/review with undefined offset param [#3019]
- Remove wordorder tracking exception [#3042]
- Single component for vocabulary trainer [#3040] [#3023]
- [MEC-1466] Use feature flag for refer a friend [#3024]
- RaF add translations for US copy [#3037]
- Styles for Choicebuttons and ChoiceItems [#3043] [#3038] [#3018]
- Release/context-template-resolver-value-exception [#3031]
- Add Choicebuttons Interaction logic [#3025]
- Cleanup/remove writing folder [#3026]
- MEC refer a friend US currency [#3022]
- Adapt wordorder feature to test punctuation [#3017]
- Uat/fix shortcut hints [#3028]
- Responsive VocabSpeak Trainer [#3004]
- Dependabot/all dependabot PRs [#3021]
- [MEC-1466] Add query param to /invite url for refer-a-friend CTA [#3015]
- [MEC-1466] Conditionally Render Refer-A-Friend Modal [#3005]
- Text markup support for VocabSpeak Trainer [#2995]
- Remove alphabet feature [#3011]

[#3045]: https://github.com/lessonnine/lesson-player.spa/pull/3045
[#3039]: https://github.com/lessonnine/lesson-player.spa/pull/3039
[#3048]: https://github.com/lessonnine/lesson-player.spa/pull/3048
[#3027]: https://github.com/lessonnine/lesson-player.spa/pull/3027
[#3019]: https://github.com/lessonnine/lesson-player.spa/pull/3019
[#3042]: https://github.com/lessonnine/lesson-player.spa/pull/3042
[#3043]: https://github.com/lessonnine/lesson-player.spa/pull/3043
[#3040]: https://github.com/lessonnine/lesson-player.spa/pull/3040
[#3024]: https://github.com/lessonnine/lesson-player.spa/pull/3024
[#3037]: https://github.com/lessonnine/lesson-player.spa/pull/3037
[#3038]: https://github.com/lessonnine/lesson-player.spa/pull/3038
[#3031]: https://github.com/lessonnine/lesson-player.spa/pull/3031
[#3025]: https://github.com/lessonnine/lesson-player.spa/pull/3025
[#3026]: https://github.com/lessonnine/lesson-player.spa/pull/3026
[#3022]: https://github.com/lessonnine/lesson-player.spa/pull/3022
[#3017]: https://github.com/lessonnine/lesson-player.spa/pull/3017
[#3023]: https://github.com/lessonnine/lesson-player.spa/pull/3023
[#3028]: https://github.com/lessonnine/lesson-player.spa/pull/3028
[#3004]: https://github.com/lessonnine/lesson-player.spa/pull/3004
[#3021]: https://github.com/lessonnine/lesson-player.spa/pull/3021
[#3018]: https://github.com/lessonnine/lesson-player.spa/pull/3018
[#3015]: https://github.com/lessonnine/lesson-player.spa/pull/3015
[#3005]: https://github.com/lessonnine/lesson-player.spa/pull/3005
[#2995]: https://github.com/lessonnine/lesson-player.spa/pull/2995
[#3011]: https://github.com/lessonnine/lesson-player.spa/pull/3011

## iOS release (20.60.0)

- [MEC-1466] Add dux resources and services needed for smart-surfaces. [#2994]
- [MEC-1466] Use localstorage with ReferAFriendModal [#2997]
- [MEC-1513] Add scroll for large screens with smaller heights [#2980]
- Add info text tests to all trainers [#2981]
- Add info_text.feature to knapsack [#2991]
- Bump eslint-config-babbel-react from 2.1.0 to 3.0.1 [#2983]
- Bump jest from 24.7.1 to 25.5.4 [#2989]
- Bump rollbar from 2.18.0 to 2.19.3 [#2985]
- Cleanup accident 🦆 [#3010]
- Cleanup some UAT tags [#2992]
- doc(services/barrels): better explanation of barrels [#3002]
- First tests for iPad [#2950]
- Fix hint button disappearing on every keypress [#2996]
- Fix interaction toggle button ref [#2993]
- iconButton min width [#2988]
- MEC-1466 fix refer a friend modal [#2974]
- More forgiving step wording [#2977]
- Release (iOS) process documentation [#2965]
- Update translations keys [#3003]

[#2950]: https://github.com/lessonnine/lesson-player.spa/pull/2950
[#2965]: https://github.com/lessonnine/lesson-player.spa/pull/2965
[#2974]: https://github.com/lessonnine/lesson-player.spa/pull/2974
[#2977]: https://github.com/lessonnine/lesson-player.spa/pull/2977
[#2980]: https://github.com/lessonnine/lesson-player.spa/pull/2980
[#2981]: https://github.com/lessonnine/lesson-player.spa/pull/2981
[#2983]: https://github.com/lessonnine/lesson-player.spa/pull/2983
[#2985]: https://github.com/lessonnine/lesson-player.spa/pull/2985
[#2988]: https://github.com/lessonnine/lesson-player.spa/pull/2988
[#2989]: https://github.com/lessonnine/lesson-player.spa/pull/2989
[#2991]: https://github.com/lessonnine/lesson-player.spa/pull/2991
[#2992]: https://github.com/lessonnine/lesson-player.spa/pull/2992
[#2993]: https://github.com/lessonnine/lesson-player.spa/pull/2993
[#2994]: https://github.com/lessonnine/lesson-player.spa/pull/2994
[#2996]: https://github.com/lessonnine/lesson-player.spa/pull/2996
[#2997]: https://github.com/lessonnine/lesson-player.spa/pull/2997
[#3002]: https://github.com/lessonnine/lesson-player.spa/pull/3002
[#3003]: https://github.com/lessonnine/lesson-player.spa/pull/3003
[#3010]: https://github.com/lessonnine/lesson-player.spa/pull/3010

## iOS release (20.59.0)

- [MEC-1464] get refer a friend reward currency [#2956]
- [MEC-1464] Include Refer A Friend component [#2923]
- [MEC-1465] Track smart surfaces events - Retry [#2969]
- [MEC-1466] Request learned_items on LessonApp, store in state. [#2943]
- Bugfix: Add bold and italic styles to Text component [#2967]
- Bugfix: Finish trainer when there is no next slide, fix NPE [#2911]
- Bugfix: Long try again button [#2926]
- Bugfix: Replace transliteration for a char [#2904]
- Bugfix: Vocabulary Click - Double clicking answer freeze [#2958]
- Bugfix: Wordorder - Compare id/index for filtering out used words [#2928]
- Bugfix: Wordorder - Gaps between single letters [#2957]
- Bugfix: Wordorder - preserve punctuation-only labels for target buttons [#2963]
- Bugfix: Wordorder - punctuation removal [#2951]
- CI: Fix two flaky integration tests [#2907]
- CI: User acceptance tests [#2947], [#2938], [#2891], [#2944], [#2940], [#2968], [#2978], [#2964]
- Code maintenance [#2976], [#2949], [#2946], [#2935], [#2914], [#2912]
- Dependency updates / security fixes [#2955], [#2970], [#2953], [#2919], [#2932], [#2933], [#2931], [#2930], [#2918], [#2921], [#2952]
- Documentation: Interaction component structure [#2936]
- Documentation: Update lesson player readme [#2927]
- Feature: Add FRA u diacritic to substitution costs [#2966]
- Feature: add transposition [#2905]
- Feature: Change button color of Dialog Show on demo page [#2975]
- Feature: Disable touch highlighting in WebKit [#2934]
- Feature: Markup support in old trainer titles [#2962]
- Feature: Markup support in Title [#2961]
- Feature: Puzzle Helper React [#2939], [#2960]
- Feature: refactor native bridges [#2896]
- Feature: Submit hint empty gap [#2916]
- Feature: Transliteration tur [#2973]
- Feature: Update popover key [#2925]
- Usabilla: Avoid overexposure of users to surveys [#2959]

[#2978]: https://github.com/lessonnine/lesson-player.spa/pull/2978
[#2976]: https://github.com/lessonnine/lesson-player.spa/pull/2976
[#2975]: https://github.com/lessonnine/lesson-player.spa/pull/2975
[#2967]: https://github.com/lessonnine/lesson-player.spa/pull/2967
[#2953]: https://github.com/lessonnine/lesson-player.spa/pull/2953
[#2968]: https://github.com/lessonnine/lesson-player.spa/pull/2968
[#2969]: https://github.com/lessonnine/lesson-player.spa/pull/2969
[#2943]: https://github.com/lessonnine/lesson-player.spa/pull/2943
[#2973]: https://github.com/lessonnine/lesson-player.spa/pull/2973
[#2952]: https://github.com/lessonnine/lesson-player.spa/pull/2952
[#2944]: https://github.com/lessonnine/lesson-player.spa/pull/2944
[#2955]: https://github.com/lessonnine/lesson-player.spa/pull/2955
[#2970]: https://github.com/lessonnine/lesson-player.spa/pull/2970
[#2956]: https://github.com/lessonnine/lesson-player.spa/pull/2956
[#2966]: https://github.com/lessonnine/lesson-player.spa/pull/2966
[#2961]: https://github.com/lessonnine/lesson-player.spa/pull/2961
[#2962]: https://github.com/lessonnine/lesson-player.spa/pull/2962
[#2964]: https://github.com/lessonnine/lesson-player.spa/pull/2964
[#2959]: https://github.com/lessonnine/lesson-player.spa/pull/2959
[#2957]: https://github.com/lessonnine/lesson-player.spa/pull/2957
[#2963]: https://github.com/lessonnine/lesson-player.spa/pull/2963
[#2960]: https://github.com/lessonnine/lesson-player.spa/pull/2960
[#2958]: https://github.com/lessonnine/lesson-player.spa/pull/2958
[#2939]: https://github.com/lessonnine/lesson-player.spa/pull/2939
[#2936]: https://github.com/lessonnine/lesson-player.spa/pull/2936
[#2951]: https://github.com/lessonnine/lesson-player.spa/pull/2951
[#2946]: https://github.com/lessonnine/lesson-player.spa/pull/2946
[#2949]: https://github.com/lessonnine/lesson-player.spa/pull/2949
[#2947]: https://github.com/lessonnine/lesson-player.spa/pull/2947
[#2940]: https://github.com/lessonnine/lesson-player.spa/pull/2940
[#2923]: https://github.com/lessonnine/lesson-player.spa/pull/2923
[#2938]: https://github.com/lessonnine/lesson-player.spa/pull/2938
[#2928]: https://github.com/lessonnine/lesson-player.spa/pull/2928
[#2934]: https://github.com/lessonnine/lesson-player.spa/pull/2934
[#2935]: https://github.com/lessonnine/lesson-player.spa/pull/2935
[#2933]: https://github.com/lessonnine/lesson-player.spa/pull/2933
[#2932]: https://github.com/lessonnine/lesson-player.spa/pull/2932
[#2931]: https://github.com/lessonnine/lesson-player.spa/pull/2931
[#2930]: https://github.com/lessonnine/lesson-player.spa/pull/2930
[#2905]: https://github.com/lessonnine/lesson-player.spa/pull/2905
[#2915]: https://github.com/lessonnine/lesson-player.spa/pull/2915
[#2891]: https://github.com/lessonnine/lesson-player.spa/pull/2891
[#2926]: https://github.com/lessonnine/lesson-player.spa/pull/2926
[#2927]: https://github.com/lessonnine/lesson-player.spa/pull/2927
[#2914]: https://github.com/lessonnine/lesson-player.spa/pull/2914
[#2896]: https://github.com/lessonnine/lesson-player.spa/pull/2896
[#2925]: https://github.com/lessonnine/lesson-player.spa/pull/2925
[#2907]: https://github.com/lessonnine/lesson-player.spa/pull/2907
[#2919]: https://github.com/lessonnine/lesson-player.spa/pull/2919
[#2924]: https://github.com/lessonnine/lesson-player.spa/pull/2924
[#2918]: https://github.com/lessonnine/lesson-player.spa/pull/2918
[#2921]: https://github.com/lessonnine/lesson-player.spa/pull/2921
[#2911]: https://github.com/lessonnine/lesson-player.spa/pull/2911
[#2912]: https://github.com/lessonnine/lesson-player.spa/pull/2912
[#2916]: https://github.com/lessonnine/lesson-player.spa/pull/2916
[#2904]: https://github.com/lessonnine/lesson-player.spa/pull/2904

## iOS release (20.57.0)

- Fix flakey integration tests [#2906]
- "Please hit enter" message added [#2910], [#2899]
- Update dependencies / security fixes [#2898], [#2884], [#2900], [#2885], [#2902], [#2901]
- Fix Wordorder keyboard shortcuts containing diacritics [#2903]
- Extend Levenshtein to support output operations [#2869]
- Camelise JSON assets [#2875]
- [TNT-1959] Update to new authentication endpoint [#2895]
- Support `CSS.escape` on older browsers [#2889]
- Introduce error boundaries for better exception handling [#2887]
- Clean up unnecessary Rollbar logs [#2890]
- Update Portuguese feedback message translation [#2888]

[#2906]: https://github.com/lessonnine/lesson-player.spa/pull/2906
[#2910]: https://github.com/lessonnine/lesson-player.spa/pull/2910
[#2898]: https://github.com/lessonnine/lesson-player.spa/pull/2898
[#2884]: https://github.com/lessonnine/lesson-player.spa/pull/2884
[#2899]: https://github.com/lessonnine/lesson-player.spa/pull/2899
[#2900]: https://github.com/lessonnine/lesson-player.spa/pull/2900
[#2885]: https://github.com/lessonnine/lesson-player.spa/pull/2885
[#2902]: https://github.com/lessonnine/lesson-player.spa/pull/2902
[#2901]: https://github.com/lessonnine/lesson-player.spa/pull/2901
[#2903]: https://github.com/lessonnine/lesson-player.spa/pull/2903
[#2869]: https://github.com/lessonnine/lesson-player.spa/pull/2869
[#2875]: https://github.com/lessonnine/lesson-player.spa/pull/2875
[#2895]: https://github.com/lessonnine/lesson-player.spa/pull/2895
[#2889]: https://github.com/lessonnine/lesson-player.spa/pull/2889
[#2887]: https://github.com/lessonnine/lesson-player.spa/pull/2887
[#2890]: https://github.com/lessonnine/lesson-player.spa/pull/2890
[#2888]: https://github.com/lessonnine/lesson-player.spa/pull/2888

## iOS release (20.56.0)

- Simulate transition from blur to focus for initial focus [#2858]
- Review End Screen for Webview [#2857]
- Replace deprecated TimeOutError with TimeoutError [#2866]
- (Docker) Serve lesson-player.spa over https [#2867]
- Feature/per word levenshtein [#2847]
- Fix app crashing when property sound is missing [#2871]
- Remove CurrentDot from ProgressBar and adapt design [#2868]
- Navbar ui improvements [#2873]
- Combined dependencies update [#2863], [#2862], [#2861],
- Release navbar ui improvements [#2872]
- Textbox: store choice item objects in textbox, not only target texts [#2795]
- Vocab wordorder in React [#2856]
- Feedback sounds fillin wo [#2878]
- Feature/vocab wordorder react spec [#2880]
- Feature/vocab wordorder react animation [#2874]
- Vocabulary wordorder UAT tests [#2865]
- Fix no-sound wordorder crash [#2882]

[#2856]: https://github.com/lessonnine/lesson-player.spa/pull/2856
[#2878]: https://github.com/lessonnine/lesson-player.spa/pull/2878
[#2877]: https://github.com/lessonnine/lesson-player.spa/pull/2877
[#2880]: https://github.com/lessonnine/lesson-player.spa/pull/2880
[#2872]: https://github.com/lessonnine/lesson-player.spa/pull/2872
[#2861]: https://github.com/lessonnine/lesson-player.spa/pull/2861
[#2862]: https://github.com/lessonnine/lesson-player.spa/pull/2862
[#2863]: https://github.com/lessonnine/lesson-player.spa/pull/2863
[#2873]: https://github.com/lessonnine/lesson-player.spa/pull/2873
[#2874]: https://github.com/lessonnine/lesson-player.spa/pull/2874
[#2865]: https://github.com/lessonnine/lesson-player.spa/pull/2865
[#2868]: https://github.com/lessonnine/lesson-player.spa/pull/2868
[#2871]: https://github.com/lessonnine/lesson-player.spa/pull/2871
[#2847]: https://github.com/lessonnine/lesson-player.spa/pull/2847
[#2867]: https://github.com/lessonnine/lesson-player.spa/pull/2867
[#2866]: https://github.com/lessonnine/lesson-player.spa/pull/2866
[#2857]: https://github.com/lessonnine/lesson-player.spa/pull/2857
[#2882]: https://github.com/lessonnine/lesson-player.spa/pull/2882

## iOS release (20.55.0)

- Small bug fixes, UI improvement, and several packet updates [#2858], [#2853], [#2852], [#2854], [#2850], [#2800], [#2828], [#2836], [#2832], [#2798], [#2834], [#2845], [#2827], [#2842], [#2835]
- Abstract mapUseCharacters to use generic tokens [#2849]
- Docker environment for running e2e tests [#2843]
- Replace old b3 vocabulary-fillin with new React implementation [#2823]
- Enforce React fragment syntax: shorthand [#2855]
- Fix for https://jira.internal.babbel.com/browse/ARTOO-1862 [#2801]
- Update styled-components to the latest version: 5.1.1 [#2832]
- Npm build script exports BUILD_COMMIT_HASH for rollbar [#2844]
- Safari users cannot use speech recognition instead of using a speech recognition mock [#2841]
- Reduce complexity in textbox scene reducer [#2838]
- Add feedback messages specific for users' spelling errors [#2820]

[#2858]: https://github.com/lessonnine/lesson-player.spa/pull/2858
[#2849]: https://github.com/lessonnine/lesson-player.spa/pull/2849
[#2843]: https://github.com/lessonnine/lesson-player.spa/pull/2843
[#2823]: https://github.com/lessonnine/lesson-player.spa/pull/2823
[#2848]: https://github.com/lessonnine/lesson-player.spa/pull/2848
[#2851]: https://github.com/lessonnine/lesson-player.spa/pull/2851
[#2855]: https://github.com/lessonnine/lesson-player.spa/pull/2855
[#2853]: https://github.com/lessonnine/lesson-player.spa/pull/2853
[#2852]: https://github.com/lessonnine/lesson-player.spa/pull/2852
[#2854]: https://github.com/lessonnine/lesson-player.spa/pull/2854
[#2850]: https://github.com/lessonnine/lesson-player.spa/pull/2850
[#2800]: https://github.com/lessonnine/lesson-player.spa/pull/2800
[#2801]: https://github.com/lessonnine/lesson-player.spa/pull/2801
[#2846]: https://github.com/lessonnine/lesson-player.spa/pull/2846
[#2828]: https://github.com/lessonnine/lesson-player.spa/pull/2828
[#2836]: https://github.com/lessonnine/lesson-player.spa/pull/2836
[#2832]: https://github.com/lessonnine/lesson-player.spa/pull/2832
[#2798]: https://github.com/lessonnine/lesson-player.spa/pull/2798
[#2834]: https://github.com/lessonnine/lesson-player.spa/pull/2834
[#2845]: https://github.com/lessonnine/lesson-player.spa/pull/2845
[#2827]: https://github.com/lessonnine/lesson-player.spa/pull/2827
[#2844]: https://github.com/lessonnine/lesson-player.spa/pull/2844
[#2842]: https://github.com/lessonnine/lesson-player.spa/pull/2842
[#2841]: https://github.com/lessonnine/lesson-player.spa/pull/2841
[#2838]: https://github.com/lessonnine/lesson-player.spa/pull/2838
[#2835]: https://github.com/lessonnine/lesson-player.spa/pull/2835
[#2820]: https://github.com/lessonnine/lesson-player.spa/pull/2820

## iOS release (20.54.0)

- Farewell Travis [#2805]
- Add infotext support to keyboard [#2807]
- Cleanup b3 infoTextPopover and continueButton components [#2809]
- Combined dependencies update [#2799] [#2797] [#2815] [#2816] [#2817] [#2818]
- Update jQuery to 3.5.1 [#2812]
- Unit test test "scene" state [#2810]
- Sheets and Puzzlehelper style fixes [#2821]
- Add Rollbar token to build [#2824]
- Replace span with Text component to avoid style inheritance [#2811]

[#2810]: https://github.com/lessonnine/lesson-player.spa/pull/2810
[#2824]: https://github.com/lessonnine/lesson-player.spa/pull/2824
[#2821]: https://github.com/lessonnine/lesson-player.spa/pull/2821
[#2816]: https://github.com/lessonnine/lesson-player.spa/pull/2816
[#2811]: https://github.com/lessonnine/lesson-player.spa/pull/2811
[#2818]: https://github.com/lessonnine/lesson-player.spa/pull/2818
[#2817]: https://github.com/lessonnine/lesson-player.spa/pull/2817
[#2812]: https://github.com/lessonnine/lesson-player.spa/pull/2812
[#2815]: https://github.com/lessonnine/lesson-player.spa/pull/2815
[#2799]: https://github.com/lessonnine/lesson-player.spa/pull/2799
[#2797]: https://github.com/lessonnine/lesson-player.spa/pull/2797
[#2809]: https://github.com/lessonnine/lesson-player.spa/pull/2809
[#2807]: https://github.com/lessonnine/lesson-player.spa/pull/2807
[#2805]: https://github.com/lessonnine/lesson-player.spa/pull/2805

## iOS release (20.53.0)

- Remove vocabulary_review:started:initial v3 [#2787]
- Configure github actions (deploy & e2e) [#2787]
- Update dependencies (combined branch for dependabot updates) [#2790] [#2784] [#2783] [#2782] [#2781] [#2741] [#2743] [#2760] [#2759]
- Textbox: store choice item objects in textbox, not only target texts [#2795]
- One global keydown event for the entire application [#2785]
- Fillin hint tests [#2780]
- Remove unobtainium [#2786]
- Release small ux imprevements and cleanup [#2792] [#2794] [#2791]
- Enable Transliteration for puzzle helper but do not show the ui [#2789]
- Replace backspace character with an icon [#2788]
- Cleanup skills code because the experiment has stopped [#2773]
- Remove service helpers and specs [#2762]
- Fix automatic scrolling in Safari [#2777]
- Remove unused trackingName from b3 [#2771]
- Type forgiveness: update substitution costs and fix normalise function [#2750]
- Do not ensure learners are logged in, rely on my.app [#2772]
- Trainer progression [#2767]
- Fix broken lesson landing screen [#2774]
- Cleanup presentational sheet components [#2751] [#2770] [#2768] [#2756] [#2763] [#2755]
- Usabilla as a survey tool [#2764]
- Update svg: asset is not centered in svg bounding box [#2769]
- Update special chars for FRA [#2752]

[#2787]: https://github.com/lessonnine/lesson-player.spa/pull/2787
[#2802]: https://github.com/lessonnine/lesson-player.spa/pull/2802
[#2790]: https://github.com/lessonnine/lesson-player.spa/pull/2790
[#2795]: https://github.com/lessonnine/lesson-player.spa/pull/2795
[#2785]: https://github.com/lessonnine/lesson-player.spa/pull/2785
[#2780]: https://github.com/lessonnine/lesson-player.spa/pull/2780
[#2786]: https://github.com/lessonnine/lesson-player.spa/pull/2786
[#2792]: https://github.com/lessonnine/lesson-player.spa/pull/2792
[#2794]: https://github.com/lessonnine/lesson-player.spa/pull/2794
[#2789]: https://github.com/lessonnine/lesson-player.spa/pull/2789
[#2791]: https://github.com/lessonnine/lesson-player.spa/pull/2791
[#2788]: https://github.com/lessonnine/lesson-player.spa/pull/2788
[#2784]: https://github.com/lessonnine/lesson-player.spa/pull/2784
[#2783]: https://github.com/lessonnine/lesson-player.spa/pull/2783
[#2782]: https://github.com/lessonnine/lesson-player.spa/pull/2782
[#2781]: https://github.com/lessonnine/lesson-player.spa/pull/2781
[#2779]: https://github.com/lessonnine/lesson-player.spa/pull/2779
[#2773]: https://github.com/lessonnine/lesson-player.spa/pull/2773
[#2778]: https://github.com/lessonnine/lesson-player.spa/pull/2778
[#2762]: https://github.com/lessonnine/lesson-player.spa/pull/2762
[#2777]: https://github.com/lessonnine/lesson-player.spa/pull/2777
[#2771]: https://github.com/lessonnine/lesson-player.spa/pull/2771
[#2750]: https://github.com/lessonnine/lesson-player.spa/pull/2750
[#2772]: https://github.com/lessonnine/lesson-player.spa/pull/2772
[#2775]: https://github.com/lessonnine/lesson-player.spa/pull/2775
[#2767]: https://github.com/lessonnine/lesson-player.spa/pull/2767
[#2774]: https://github.com/lessonnine/lesson-player.spa/pull/2774
[#2751]: https://github.com/lessonnine/lesson-player.spa/pull/2751
[#2764]: https://github.com/lessonnine/lesson-player.spa/pull/2764
[#2741]: https://github.com/lessonnine/lesson-player.spa/pull/2741
[#2770]: https://github.com/lessonnine/lesson-player.spa/pull/2770
[#2769]: https://github.com/lessonnine/lesson-player.spa/pull/2769
[#2768]: https://github.com/lessonnine/lesson-player.spa/pull/2768
[#2752]: https://github.com/lessonnine/lesson-player.spa/pull/2752
[#2743]: https://github.com/lessonnine/lesson-player.spa/pull/2743
[#2756]: https://github.com/lessonnine/lesson-player.spa/pull/2756
[#2760]: https://github.com/lessonnine/lesson-player.spa/pull/2760
[#2759]: https://github.com/lessonnine/lesson-player.spa/pull/2759
[#2763]: https://github.com/lessonnine/lesson-player.spa/pull/2763
[#2755]: https://github.com/lessonnine/lesson-player.spa/pull/2755

## iOS release (20.52.0)

- Remove explicit continue step [#2748]
- Squash ADR platform separation [#2746]
- Fix Dialog Speak - always show Continue Button to proceed [#2753]
- Separate lesson completion from close [#2738]
- Bump postcss-prefixer from 2.1.1 to 2.1.2 [#2742]
- Integration tests: Remove explicit continue step after writing [#2744]
- Align use of translations in UI components [#2739]
- Use b3.continueSheet instead of FeedbackSheet [#2745]
- Remove UX edge case that appends space to attempt [#2737]

[#2748]: https://github.com/lessonnine/lesson-player.spa/pull/2748
[#2746]: https://github.com/lessonnine/lesson-player.spa/pull/2746
[#2753]: https://github.com/lessonnine/lesson-player.spa/pull/2753
[#2738]: https://github.com/lessonnine/lesson-player.spa/pull/2738
[#2742]: https://github.com/lessonnine/lesson-player.spa/pull/2742
[#2744]: https://github.com/lessonnine/lesson-player.spa/pull/2744
[#2739]: https://github.com/lessonnine/lesson-player.spa/pull/2739
[#2745]: https://github.com/lessonnine/lesson-player.spa/pull/2745
[#2737]: https://github.com/lessonnine/lesson-player.spa/pull/2737

## iOS release (20.51.0)

- Increased base font size for webview along with a dedicated css [#2721]
- Added tracking event info to errors [#2721]
- Don’t show feedback sheet twice if interaction uses new infotext [#2721]
- Updated transliteration chars [#2721] [#2695] [#2689]
- Uniformed trainer titles [#2718] [#2723]
- Added continue sheet after the last item of the Vocabulary trainer [#2721]
- Removed pose animations from feedback sheet [#2713]
- Refocus input after Hint or Transliteration [#2710]
- Remove logging of account data [#2701]
- Track transliteration table [#2699]
- Track Hint tooltip [#2697] [#2692] [#2690] [#2691]
- Typing tips translation [#2696]
- Fix CAT preview for vocabulary wordorder [#2687]
- Decrease the number of clicks the user needs to proceed [#2686]
- Fixed InputHint: only remove first character if its empty [#2685]
- Don’t show positive feedback every time an item is completed [#2682]
- Add a custom keyup listener for gap feedback [#2684]
- Add tracking lesson landing screen [#2680]
- Add tracking event info to errors [#2679]
- Enable keyboard input for puzzlehelper [#2678]
- Feature/all l2 transliteration [#2676] [#2675] [#2672] [#2671] [#2673]
- WithSpeech: always check correctness of the last result [#2669]
- Textbox style tweaks [#2668]
- Do not track 'vocabulary_review:type_chosen' in webview [#2664]
- Update speaking trainer translations [#2653]

[#2723]: https://github.com/lessonnine/lesson-player.spa/pull/2723
[#2721]: https://github.com/lessonnine/lesson-player.spa/pull/2721
[#2679]: https://github.com/lessonnine/lesson-player.spa/pull/2679
[#2718]: https://github.com/lessonnine/lesson-player.spa/pull/2718
[#2680]: https://github.com/lessonnine/lesson-player.spa/pull/2680
[#2713]: https://github.com/lessonnine/lesson-player.spa/pull/2713
[#2710]: https://github.com/lessonnine/lesson-player.spa/pull/2710
[#2701]: https://github.com/lessonnine/lesson-player.spa/pull/2701
[#2699]: https://github.com/lessonnine/lesson-player.spa/pull/2699
[#2691]: https://github.com/lessonnine/lesson-player.spa/pull/2691
[#2697]: https://github.com/lessonnine/lesson-player.spa/pull/2697
[#2696]: https://github.com/lessonnine/lesson-player.spa/pull/2696
[#2695]: https://github.com/lessonnine/lesson-player.spa/pull/2695
[#2692]: https://github.com/lessonnine/lesson-player.spa/pull/2692
[#2689]: https://github.com/lessonnine/lesson-player.spa/pull/2689
[#2690]: https://github.com/lessonnine/lesson-player.spa/pull/2690
[#2687]: https://github.com/lessonnine/lesson-player.spa/pull/2687
[#2686]: https://github.com/lessonnine/lesson-player.spa/pull/2686
[#2685]: https://github.com/lessonnine/lesson-player.spa/pull/2685
[#2684]: https://github.com/lessonnine/lesson-player.spa/pull/2684
[#2682]: https://github.com/lessonnine/lesson-player.spa/pull/2682
[#2676]: https://github.com/lessonnine/lesson-player.spa/pull/2676
[#2675]: https://github.com/lessonnine/lesson-player.spa/pull/2675
[#2672]: https://github.com/lessonnine/lesson-player.spa/pull/2672
[#2671]: https://github.com/lessonnine/lesson-player.spa/pull/2671
[#2673]: https://github.com/lessonnine/lesson-player.spa/pull/2673
[#2678]: https://github.com/lessonnine/lesson-player.spa/pull/2678
[#2669]: https://github.com/lessonnine/lesson-player.spa/pull/2669
[#2668]: https://github.com/lessonnine/lesson-player.spa/pull/2668
[#2664]: https://github.com/lessonnine/lesson-player.spa/pull/2664
[#2653]: https://github.com/lessonnine/lesson-player.spa/pull/2653

## iOS release (20.50.0)

- No changes.

## iOS release (20.49.0)

- Add web UI for fillin hint button [#2644]
- Remove unused native keyboard code [#2638]
- Use language specific substitution costs for Fillin [#2641] [#2626]
- Add latest colours from design-tokens.lib [#2640]
- Add new info text UI (web only) [#2649] [#2630]
- Bugfix: web tracking events from webview [#2647] [#2623]
- Improve code flow navigateToReturnUrl & abortLesson [#2628]
- Add lesson landing screen page (web only) [#2621]
- Fix critical problem with IE11 [#2636]
- Add Emarsys tracking for deeplinks (web only) [#2632]
- Enable review in webview [#2633] [#2624]

[#2644]: https://github.com/lessonnine/lesson-player.spa/pull/2644
[#2638]: https://github.com/lessonnine/lesson-player.spa/pull/2638
[#2641]: https://github.com/lessonnine/lesson-player.spa/pull/2641
[#2640]: https://github.com/lessonnine/lesson-player.spa/pull/2640
[#2649]: https://github.com/lessonnine/lesson-player.spa/pull/2649
[#2647]: https://github.com/lessonnine/lesson-player.spa/pull/2647
[#2623]: https://github.com/lessonnine/lesson-player.spa/pull/2623
[#2628]: https://github.com/lessonnine/lesson-player.spa/pull/2628
[#2621]: https://github.com/lessonnine/lesson-player.spa/pull/2621
[#2636]: https://github.com/lessonnine/lesson-player.spa/pull/2636
[#2630]: https://github.com/lessonnine/lesson-player.spa/pull/2630
[#2626]: https://github.com/lessonnine/lesson-player.spa/pull/2626
[#2632]: https://github.com/lessonnine/lesson-player.spa/pull/2632
[#2633]: https://github.com/lessonnine/lesson-player.spa/pull/2633
[#2624]: https://github.com/lessonnine/lesson-player.spa/pull/2624

## iOS release (20.48.0)

- New UI for giving hint to the user [#2613]
- No longer swithching to puzzle helper mode when clicking the Help button [#2613]
- No longer button for puzzleHelper to Fillin [#2613]
- Update React to latest [#2620]
- Update Eslint rules and packages [#2622]

[#2613]: https://github.com/lessonnine/lesson-player.spa/pull/2613
[#2620]: https://github.com/lessonnine/lesson-player.spa/pull/2620
[#2622]: https://github.com/lessonnine/lesson-player.spa/pull/2622

## iOS release (20.47.0)

- Fix lesson completions for skills experiment [#2617]
- Continue abort lesson flow even if tracking fails [#2616]
- Stop sending Rollbars for "Listening Trainer can't play sound" [#2615]
- Add UI for info texts [#2612] [#2609]
- Update tracking events to include `content_release_id` [#2611]
- Add offline queue for tracking events on web [#2608] [#2601] [#2594]
- Reduce Rollbar traffic (debug messages) [#2606] [#2604] [#2603] [#2602]
- Integration test improvements [#2598] [#2600]
- Do not convert Vocabulary Fillin into Vocabulary Puzzle helper [#2596]

[#2617]: https://github.com/lessonnine/lesson-player.spa/pull/2617
[#2616]: https://github.com/lessonnine/lesson-player.spa/pull/2616
[#2615]: https://github.com/lessonnine/lesson-player.spa/pull/2615
[#2612]: https://github.com/lessonnine/lesson-player.spa/pull/2612
[#2611]: https://github.com/lessonnine/lesson-player.spa/pull/2611
[#2597]: https://github.com/lessonnine/lesson-player.spa/pull/2597
[#2609]: https://github.com/lessonnine/lesson-player.spa/pull/2609
[#2610]: https://github.com/lessonnine/lesson-player.spa/pull/2610
[#2605]: https://github.com/lessonnine/lesson-player.spa/pull/2605
[#2608]: https://github.com/lessonnine/lesson-player.spa/pull/2608
[#2607]: https://github.com/lessonnine/lesson-player.spa/pull/2607
[#2606]: https://github.com/lessonnine/lesson-player.spa/pull/2606
[#2604]: https://github.com/lessonnine/lesson-player.spa/pull/2604
[#2603]: https://github.com/lessonnine/lesson-player.spa/pull/2603
[#2602]: https://github.com/lessonnine/lesson-player.spa/pull/2602
[#2601]: https://github.com/lessonnine/lesson-player.spa/pull/2601
[#2600]: https://github.com/lessonnine/lesson-player.spa/pull/2600
[#2594]: https://github.com/lessonnine/lesson-player.spa/pull/2594
[#2598]: https://github.com/lessonnine/lesson-player.spa/pull/2598
[#2596]: https://github.com/lessonnine/lesson-player.spa/pull/2596

## iOS release (20.46.0)

- Fixed a bug where the translations alignment in wordorder was wrongly displayed [#2587]
- Fixed a bug in Comprehension Text where the user could be lead to a white screen [#2586]
- Fixed a bug that caused Dialog Speak and Dictate Wordorder to not be rendered to the users anymore. [#2589]
- Renamed some translations keys according to the trainers names [#2558] [#2592]
- Deprecated some trainers as part of trainers reduction project [#2584]
- Switched to use the v3 lesson content api endpoint [#2593]
- Adjust to render correctly the Vocabulary Click and Vocabulary Choicebuttons trainers according to the new api version. [#2595]
- Added trainer type to rollbar logs for skipped trainers [#2590]

[#2586]: https://github.com/lessonnine/lesson-player.spa/pull/2586
[#2587]: https://github.com/lessonnine/lesson-player.spa/pull/2587
[#2589]: https://github.com/lessonnine/lesson-player.spa/pull/2589
[#2558]: https://github.com/lessonnine/lesson-player.spa/pull/2558
[#2592]: https://github.com/lessonnine/lesson-player.spa/pull/2592
[#2584]: https://github.com/lessonnine/lesson-player.spa/pull/2584
[#2593]: https://github.com/lessonnine/lesson-player.spa/pull/2593
[#2595]: https://github.com/lessonnine/lesson-player.spa/pull/2595
[#2590]: https://github.com/lessonnine/lesson-player.spa/pull/2590

## iOS release (20.45.0)

- Improved control of system keyboard. In Fillin interactions the system keyboard is opened automatically for the first and also for subsequent gaps. Learners no longer need to tap the gap or a special button to open the keyboard. [#2565]
- Improved Fillin behavior. Soft keyboard is now only defaulting to uppercase character set for first character if the target text is actually starting with an uppercase letter. [#2578]
- Resolved the "emoji overload" in feedback messages that resulted from one emoji being part of the translation key and another one being appended to every feedback message in the code. [#2573]
- Translation library is updated to v2.0.3 [#2574]
- Fixed a bug in vocabulary write/choose trainers. [#2577]

[#2578]: https://github.com/lessonnine/lesson-player.spa/pull/2578
[#2577]: https://github.com/lessonnine/lesson-player.spa/pull/2577
[#2574]: https://github.com/lessonnine/lesson-player.spa/pull/2574
[#2573]: https://github.com/lessonnine/lesson-player.spa/pull/2573
[#2565]: https://github.com/lessonnine/lesson-player.spa/pull/2565
