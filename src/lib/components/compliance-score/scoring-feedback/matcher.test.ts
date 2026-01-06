import { describe, test, expect, beforeEach } from 'vitest';
import { ScoringFeedbackMatcher } from './matcher';

describe('ScoringFeedbackMatcher', () => {
	let matcher: ScoringFeedbackMatcher;

	beforeEach(() => {
		matcher = new ScoringFeedbackMatcher();
	});

	describe('findBestMatch', () => {
		beforeEach(() => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Validators fear this bag!', image: '/star-struck.png', angle: 315 }
			});

			matcher.addRule({
				carryOnRange: { min: 60, max: 100 },
				personalItemRange: { min: 60, max: 100 },
				result: { message: 'Solid travel companion.', image: '/smirking.png', angle: 315 }
			});

			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 0, max: 60 },
				result: { message: 'Overhead bin hero, underseat zero.', image: '/winking.png', angle: 315 }
			});

			matcher.addRule({
				carryOnRange: { min: 50, max: 70 },
				personalItemRange: { min: 50, max: 70 },
				result: { message: "It's gonna be a tight squeeze.", image: '/melting.png', angle: 45 }
			});

			matcher.addRule({
				carryOnRange: { min: 0, max: 50 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Living dangerously, I see.', image: '/downcast.png', angle: 45 }
			});
		});

		test('single rule matches', () => {
			const result = matcher.findBestMatch(25, 25);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Living dangerously, I see.');
		});

		test('multiple rules match - returns most specific', () => {
			const result = matcher.findBestMatch(95, 95);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Validators fear this bag!');
		});

		test('both good scores', () => {
			const result = matcher.findBestMatch(80, 80);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Solid travel companion.');
		});

		test('asymmetric - excellent carry-on, poor personal', () => {
			const result = matcher.findBestMatch(95, 40);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Overhead bin hero, underseat zero.');
		});

		test('both mediocre', () => {
			const result = matcher.findBestMatch(60, 60);
			expect(result).not.toBeNull();
			expect(result?.message).toBe("It's gonna be a tight squeeze.");
		});

		test('both poor', () => {
			const result = matcher.findBestMatch(40, 40);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Living dangerously, I see.');
		});

		test('no match returns null', () => {
			const result = matcher.findBestMatch(75, 45);
			expect(result).toBeNull();
		});
	});

	describe('coverage-based priority', () => {
		test('smallest coverage wins when multiple match', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Most specific', image: '/star-struck.png', angle: 315 }
			});

			matcher.addRule({
				carryOnRange: { min: 60, max: 100 },
				personalItemRange: { min: 60, max: 100 },
				result: { message: 'Less specific', image: '/smirking.png', angle: 315 }
			});

			const result = matcher.findBestMatch(95, 95);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Most specific');
		});

		test('verify coverage calculation priority', () => {
			matcher.addRule({
				carryOnRange: { min: 50, max: 70 },
				personalItemRange: { min: 50, max: 70 },
				result: { message: 'Coverage 400', image: '/test1.png', angle: 0 }
			});

			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 0, max: 60 },
				result: { message: 'Coverage 600', image: '/test2.png', angle: 0 }
			});

			matcher.addRule({
				carryOnRange: { min: 0, max: 100 },
				personalItemRange: { min: 0, max: 100 },
				result: { message: 'Coverage 10000', image: '/test3.png', angle: 0 }
			});

			const result = matcher.findBestMatch(60, 60);
			expect(result).not.toBeNull();
			expect(result?.message).toBe('Coverage 400');
		});
	});

	describe('shadowing detection', () => {
		test('throws error when new rule completely shadows existing rule with same range', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Specific rule', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 90, max: 100 },
					personalItemRange: { min: 90, max: 100 },
					result: { message: 'Duplicate rule', image: '/test.png', angle: 0 }
				});
			}).toThrow('completely shadows');
		});

		test('detects multiple existing rules being shadowed', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 90, max: 100 },
					personalItemRange: { min: 90, max: 100 },
					result: { message: 'Rule 2', image: '/test.png', angle: 0 }
				});
			}).toThrow('completely shadows existing rule(s): "Rule 1"');
		});

		test('does not throw for rules with overlapping but different coverage', () => {
			matcher.addRule({
				carryOnRange: { min: 80, max: 95 },
				personalItemRange: { min: 80, max: 95 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 85, max: 100 },
					personalItemRange: { min: 85, max: 110 },
					result: { message: 'Rule 2', image: '/test.png', angle: 0 }
				});
			}).not.toThrow();
		});

		test('does not throw when rules partially overlap but neither shadows the other', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 0, max: 60 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 60, max: 100 },
					personalItemRange: { min: 60, max: 100 },
					result: { message: 'Rule 2', image: '/test.png', angle: 0 }
				});
			}).not.toThrow();
		});

		test('does not throw when broad rule has larger coverage than narrow rule', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Narrow with small coverage', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 80, max: 100 },
					personalItemRange: { min: 80, max: 100 },
					result: { message: 'Broad with large coverage', image: '/test.png', angle: 0 }
				});
			}).not.toThrow();
		});

		test('does not throw when narrow rule has smaller coverage than broad rule', () => {
			matcher.addRule({
				carryOnRange: { min: 50, max: 100 },
				personalItemRange: { min: 50, max: 100 },
				result: { message: 'Broad with large coverage', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 60, max: 80 },
					personalItemRange: { min: 60, max: 80 },
					result: { message: 'Narrow with small coverage', image: '/test.png', angle: 0 }
				});
			}).not.toThrow();
		});

		test('throws when narrow rule added after broad rule with smaller coverage', () => {
			matcher.addRule({
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Narrow with small coverage', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 90, max: 100 },
					personalItemRange: { min: 90, max: 100 },
					result: { message: 'Same coverage', image: '/test.png', angle: 0 }
				});
			}).toThrow();
		});
	});

	describe('ambiguous overlap detection', () => {
		test('throws for boundary-touching ranges with equal coverage', () => {
			matcher.addRule({
				carryOnRange: { min: 0, max: 50 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Lower half', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 50, max: 100 },
					personalItemRange: { min: 50, max: 100 },
					result: { message: 'Upper half', image: '/test.png', angle: 0 }
				});
			}).toThrow('ambiguous overlap');
		});

		test('throws for partial overlap with equal coverage', () => {
			matcher.addRule({
				carryOnRange: { min: 80, max: 95 },
				personalItemRange: { min: 80, max: 95 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 85, max: 100 },
					personalItemRange: { min: 85, max: 100 },
					result: { message: 'Rule 2', image: '/test.png', angle: 0 }
				});
			}).toThrow('ambiguous overlap');
		});

		test('throws for different shapes with same coverage that overlap', () => {
			matcher.addRule({
				carryOnRange: { min: 0, max: 100 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Wide and short', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 0, max: 50 },
					personalItemRange: { min: 0, max: 100 },
					result: { message: 'Narrow and tall', image: '/test.png', angle: 0 }
				});
			}).toThrow('ambiguous overlap');
		});

		test('does not throw for non-overlapping ranges with equal coverage', () => {
			matcher.addRule({
				carryOnRange: { min: 0, max: 40 },
				personalItemRange: { min: 0, max: 40 },
				result: { message: 'Lower range', image: '/test.png', angle: 0 }
			});

			expect(() => {
				matcher.addRule({
					carryOnRange: { min: 60, max: 100 },
					personalItemRange: { min: 60, max: 100 },
					result: { message: 'Upper range', image: '/test.png', angle: 0 }
				});
			}).not.toThrow();
		});

		test('error message includes coverage information', () => {
			matcher.addRule({
				carryOnRange: { min: 0, max: 50 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Rule A', image: '/test.png', angle: 0 }
			});

			try {
				matcher.addRule({
					carryOnRange: { min: 50, max: 100 },
					personalItemRange: { min: 50, max: 100 },
					result: { message: 'Rule B', image: '/test.png', angle: 0 }
				});
				expect.fail('Should have thrown an error');
			} catch (e: any) {
				expect(e.message).toContain('2500');
				expect(e.message).toContain('Rule A');
				expect(e.message).toContain('order-dependent');
			}
		});
	});
});
