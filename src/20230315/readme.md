# Task

- refactoring the rate calcuration.
- Update the rate-1 and the rate-2.
  - the first step: play and expand "バ"
  - the second step: play and expand "タン", then shrink "バ"

# Overview

Link to sketch: https://ocello3.github.io/playground/?date=20230315

# Composition

- There are 4 compartments.
  - index-0: left-above
  - index-1: right-above
  - index-2: left-below
  - index-3: right-below

# Timeline

## scale_1vs2and3

- init
  - Init parameters, i.e. duration, maxRate, and minRate.
  - Move to "waiting" status in the next frame.
- waiting
  - After the duration time has passed, move to "attack_1".
  - The rate is constant.
- attack_1
  - After the rate becomes to be the max rate, move to "sustain_1".
  - Increase the rate.
- sustain_1
  - After the duration time has passed, move to "attack_2".
  - The rate is constant.
- attack_2
  - After the rate becomes to be the min rate, move to "sustain_2".
  - Decrease the rate.
- sustain_2
  - After the duration time has passed, move to "release".
  - The rate is constant.
- release
  - After the rate becomes to be the base rate, move to "init".
  - Decrease the rate.

## scale_2vs3

- init
  - When the status of "scale_1vs2and3" is "init"
- waiting
  - When the status of "scale_1vs2and3" is "waiting" or "attack_1" or "sustain_2"
  - The rate is constant.
- attack
  - When the status of "scale_1vs2and3" is "attack_2"
  - Increase the rate
- release
  - When the status of "scale_1vs2and3" is "release"
  - Decrease the rate until it becomes to be the base rate

## Sound

### background

- Choose one from three "long" samples
- When the end of the sample, choose and play the next sample
- Repeat

### バタン

- Use a "knock" sample for "バ"
- Use a "low" sample for "タン"

# History

## 2023/3/19

- create readme
- `scaleRate_1` and `scaleRate_2` are confusing -> use `scale_1-2and3` and `scale_2-3`
- change the base font size per each font by "baseScaleRates"
- create 4 font objects
- convert wave format to mp3 format using FFmpeg
- create bash script for FFmpeg and remove mp3 files: https://qiita.com/ruri14/items/819687181787f4ebddf4

## 2023/3/20-21

- create timeline
- considered to use the Envelope class of Tone and convert animation frame rate by Draw class, but it looks unavailable.

## 2023/3/22

- create rate_1 and rate_2
- need to re-check relatiionshipt between scale_1vs2and3/scale_2vs3 and scales
