import { useEffect } from "react";
import $ from "jquery";

export default function HomePage() {
	useEffect(() => {
		$(".nav li:first").addClass("active");

		var showSection = function showSection(section, isAnimate) {
			var direction = section.replace(/#/, ""),
				reqSection = $(".section").filter('[data-section="' + direction + '"]'),
				reqSectionPos = reqSection.offset().top - 0;

			if (isAnimate) {
				$("body, html").animate(
					{
						scrollTop: reqSectionPos,
					},
					800
				);
			} else {
				$("body, html").scrollTop(reqSectionPos);
			}
		};

		var checkSection = function checkSection() {
			$(".section").each(function () {
				var $this = $(this),
					topEdge = $this.offset().top - 80,
					bottomEdge = topEdge + $this.height(),
					wScroll = $(window).scrollTop();
				if (topEdge < wScroll && bottomEdge > wScroll) {
					var currentId = $this.data("section"),
						reqLink = $("a").filter("[href*=\\#" + currentId + "]");
					reqLink
						.closest("li")
						.addClass("active")
						.siblings()
						.removeClass("active");
				}
			});
		};

		$(".main-menu, .responsive-menu, .scroll-to-section").on(
			"click",
			"a",
			function (e) {
				e.preventDefault();
				showSection($(this).attr("href"), true);
			}
		);

		$(window).scroll(function () {
			checkSection();
		});
	}, []);

	return (
		<>
			<header class="header-area header-sticky">
				<div class="container">
					<div class="row">
						<div class="col-12">
							<nav class="main-nav">
								<a href="index.html" class="logo">
									Edu Meeting
								</a>

								<ul class="nav">
									<li class="scroll-to-section">
										<a href="#top" class="active">
											Home
										</a>
									</li>
									<li class="has-sub">
										<a href="javascript:void(0)">Profil Sekolah</a>
										<ul class="sub-menu">
											<li>
												<a href="meetings.html">Sejarah Singkat</a>
											</li>
											<li>
												<a href="meeting-details.html">Visi, Misi, & Tujuan</a>
											</li>
										</ul>
									</li>

									<li class="has-sub">
										<a href="javascript:void(0)">Login</a>
										<ul class="sub-menu">
											<li>
												<a href="meetings.html">Admin</a>
											</li>
											<li>
												<a href="meeting-details.html">User</a>
											</li>
										</ul>
									</li>
									<li class="scroll-to-section">
										<a href="#ekskul">Ekskul</a>
									</li>
									<li class="scroll-to-section">
										<a href="#contact">Hubungi Kami</a>
									</li>
								</ul>
								<a class="menu-trigger">
									<span>Menu</span>
								</a>
								{/* <!-- ***** Menu End ***** --> */}
							</nav>
						</div>
					</div>
				</div>
			</header>
			{/* <!-- ***** Header Area End ***** --> */}

			{/* <!-- ***** Main Banner Area Start ***** --> */}
			<section class="section main-banner" id="top" data-section="section1">
				<video autoplay muted loop id="bg-video">
					<source src="assets/images/course-video.mp4" type="video/mp4" />
				</video>

				<div class="video-overlay header-text">
					<div class="container">
						<div class="row">
							<div class="col-lg-12">
								<div class="caption">
									<h6>Halo Para Penerus Bangsa</h6>
									<h2>Selamat Datang di SMP At-Thahirin</h2>
									<p>
										SMP At-Thahirin senantiasa bergerak maju ke depan untuk
										mencetak generasi penerus bangsa yang menjunjung tinggi
										akhlak dan memiliki ilmu pengtehuan yang unggul. SMP
										At-Thahirin bertekad untuk menciptakan suasana sekolah yang
										menyenangkan, aman, dan nyaman bagi semua <i>stakeholder</i>{" "}
										dan memiliki beberapa program{" "}
										<a rel="nofollow" href="#ekskul">
											ekskul unggulan
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* <!-- ***** Main Banner Area End ***** --> */}

			<section class="services">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<div class="owl-service-item owl-carousel">
								<div class="item">
									<div class="icon">
										{/* <img src="assets/images/service-icon-01.png" alt="" > */}
									</div>
									<div class="down-content">
										<h4>Best Education</h4>
										<p>
											Suspendisse tempor mauris a sem elementum bibendum.
											Praesent facilisis massa non vestibulum.
										</p>
									</div>
								</div>

								<div class="item">
									<div class="icon">
										<img src="assets/images/service-icon-02.png" alt="" />
									</div>
									<div class="down-content">
										<h4>Best Teachers</h4>
										<p>
											Suspendisse tempor mauris a sem elementum bibendum.
											Praesent facilisis massa non vestibulum.
										</p>
									</div>
								</div>

								<div class="item">
									<div class="icon">
										<img src="assets/images/service-icon-03.png" alt="" />
									</div>
									<div class="down-content">
										<h4>Best Students</h4>
										<p>
											Suspendisse tempor mauris a sem elementum bibendum.
											Praesent facilisis massa non vestibulum.
										</p>
									</div>
								</div>

								<div class="item">
									<div class="icon">
										<img src="assets/images/service-icon-02.png" alt="" />
									</div>
									<div class="down-content">
										<h4>Online Meeting</h4>
										<p>
											Suspendisse tempor mauris a sem elementum bibendum.
											Praesent facilisis massa non vestibulum.
										</p>
									</div>
								</div>

								<div class="item">
									<div class="icon">
										<img src="assets/images/service-icon-03.png" alt="" />
									</div>
									<div class="down-content">
										<h4>Best Networking</h4>
										<p>
											Suspendisse tempor mauris a sem elementum bibendum.
											Praesent facilisis massa non vestibulum.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="our-courses" id="ekskul">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<div class="section-heading">
								<h2>Our Popular Courses</h2>
							</div>
						</div>
						<div class="col-lg-12">
							<div class="owl-courses-item owl-carousel">
								<div class="item">
									<img src="assets/images/course-01.jpg" alt="Course One" />
									<div class="down-content">
										<h4>Morbi tincidunt elit vitae justo rhoncus</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$160</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-02.jpg" alt="Course Two" />
									<div class="down-content">
										<h4>Curabitur molestie dignissim purus vel</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$180</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-03.jpg" alt="" />
									<div class="down-content">
										<h4>Nulla at ipsum a mauris egestas tempor</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$140</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-04.jpg" alt="" />
									<div class="down-content">
										<h4>Aenean molestie quis libero gravida</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$120</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-01.jpg" alt="" />
									<div class="down-content">
										<h4>Lorem ipsum dolor sit amet adipiscing elit</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$250</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-02.jpg" alt="" />
									<div class="down-content">
										<h4>TemplateMo is the best website for Free CSS</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$270</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-03.jpg" alt="" />
									<div class="down-content">
										<h4>Web Design Templates at your finger tips</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$340</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-04.jpg" alt="" />
									<div class="down-content">
										<h4>Please visit our website again</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$360</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-01.jpg" alt="" />
									<div class="down-content">
										<h4>Responsive HTML Templates for you</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$400</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-02.jpg" alt="" />
									<div class="down-content">
										<h4>Download Free CSS Layouts for your business</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$430</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-03.jpg" alt="" />
									<div class="down-content">
										<h4>Morbi in libero blandit lectus cursus</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$480</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item">
									<img src="assets/images/course-04.jpg" alt="" />
									<div class="down-content">
										<h4>Curabitur molestie dignissim purus</h4>
										<div class="info">
											<div class="row">
												<div class="col-8">
													<ul>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
														<li>
															<i class="fa fa-star"></i>
														</li>
													</ul>
												</div>
												<div class="col-4">
													<span>$560</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
